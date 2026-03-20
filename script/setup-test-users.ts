/**
 * Setup Test Users for E2E Testing
 * This script creates test user accounts in Supabase TEST project
 * Run with: npx ts-node scripts/setup-test-users.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

// Load test environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.test') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase environment variables in .env.test')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceRoleKey ? '✓' : '✗')
  process.exit(1)
}

// Use service role key for admin operations
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

  for (const testUser of testUsers) {
    try {
      console.log(`\n👤 Creating user: ${testUser.email}`)

      // Check if user already exists
      const { data: existingUser } = await supabase.auth.admin.listUsers()
      const userExists = existingUser?.users?.some((u) => u.email === testUser.email)

      if (userExists) {
        console.log(`   ⚠️  User already exists, skipping...`)
        continue
      }

      // Create user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: testUser.email,
        password: testUser.password,
        email_confirm: true,
      })

      if (authError) {
        console.error(`   ❌ Error creating auth user:`, authError.message)
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
        console.error(`   ❌ Error creating user profile:`, profileError.message)
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
          console.warn(`   ⚠️  Could not create portfolio:`, portfolioError.message)
        }
      }

      console.log(`   ✅ User created successfully!`)
      console.log(`      User ID: ${userId}`)
      console.log(`      Email: ${testUser.email}`)
      console.log(`      Role: ${testUser.is_admin ? 'Admin' : 'User'}`)
    } catch (error: any) {
      console.error(`   ❌ Unexpected error:`, error.message)
    }
  }

  console.log('\n✨ Setup complete!\n')
  console.log('Test Credentials:')
  testUsers.forEach((user) => {
    console.log(`  • Email: ${user.email}`)
    console.log(`    Password: ${user.password}`)
    console.log(`    Role: ${user.is_admin ? 'Admin' : 'User'}\n`)
  })
}

setupTestUsers().catch(console.error)
