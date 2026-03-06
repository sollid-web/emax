#!/usr/bin/env node
/**
 * Setup Test Users for E2E Testing (Node.js)
 * Run with: node scripts/setup-test-users.js
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.test' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing Supabase environment variables in .env.test')
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗')
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceRoleKey ? '✓' : '✗')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const testUsers = [
  {
    email: 'test@example.com',
    password: 'Test123456!',
    fullname: 'Test User',
    username: 'testuser',
    is_admin: false,
  },
  {
    email: 'admin@example.com',
    password: 'Test123456!',
    fullname: 'Admin User',
    username: 'adminuser',
    is_admin: true,
  },
]

async function setupTestUsers() {
  console.log('🚀 Setting up test users in Supabase TEST project...')
  console.log(`📍 Supabase URL: ${supabaseUrl}\n`)

  let successCount = 0
  let skipCount = 0
  let failureCount = 0

  for (const testUser of testUsers) {
    try {
      console.log(`\n👤 Creating user: ${testUser.email}`)

      // Create user with Supabase Auth (admin API)
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: testUser.email,
        password: testUser.password,
        email_confirm: true,
      })

      if (authError) {
        // Check if user already exists (error message contains "already exists")
        if (authError.message?.includes('already exists')) {
          console.log(`   ⚠️  User already exists, skipping...`)
          skipCount++
          continue
        }
        console.error(`   ❌ Error creating auth user: ${authError.message}`)
        failureCount++
        continue
      }

      if (!authData.user) {
        console.error(`   ❌ No user returned from creation`)
        failureCount++
        continue
      }

      const userId = authData.user.id

      // Create user profile in users table
      const { error: profileError } = await supabase.from('users').insert([
        {
          id: userId,
          email: testUser.email,
          fullname: testUser.fullname,
          username: testUser.username,
          is_admin: testUser.is_admin,
        },
      ])

      if (profileError) {
        console.error(`   ❌ Error creating user profile: ${profileError.message}`)
        failureCount++
        continue
      }

      // Create portfolio for regular users
      if (!testUser.is_admin) {
        const { error: portfolioError } = await supabase.from('portfolios').insert([
          {
            user_id: userId,
            total_invested: 0,
            current_balance: 0,
            total_profit: 0,
            profit_percentage: 0,
          },
        ])

        if (portfolioError) {
          console.warn(`   ⚠️  Could not create portfolio: ${portfolioError.message}`)
        }
      }

      console.log(`   ✅ User created successfully!`)
      console.log(`      User ID: ${userId}`)
      console.log(`      Email: ${testUser.email}`)
      console.log(`      Role: ${testUser.is_admin ? 'Admin' : 'User'}`)
      successCount++
    } catch (error) {
      console.error(`   ❌ Unexpected error: ${error.message}`)
      failureCount++
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('✨ Setup Summary:')
  console.log(`   ✅ Created: ${successCount}`)
  console.log(`   ⚠️  Skipped: ${skipCount}`)
  console.log(`   ❌ Failed: ${failureCount}`)
  console.log('='.repeat(50))

  if (successCount > 0 || skipCount > 0) {
    console.log('\n📝 Test Credentials:')
    testUsers.forEach((user) => {
      console.log(`\n   Email:    ${user.email}`)
      console.log(`   Password: ${user.password}`)
      console.log(`   Role:     ${user.is_admin ? 'Admin' : 'User'}`)
    })
  }

  console.log()
  process.exit(failureCount > 0 && successCount === 0 ? 1 : 0)
}

setupTestUsers().catch((error) => {
  console.error('Fatal error:', error.message)
  process.exit(1)
})
