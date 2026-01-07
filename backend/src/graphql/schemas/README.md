# GraphQL Schema Organization

This directory contains modular GraphQL schema files organized by feature/module.

## Structure

```
schemas/
├── README.md                          # This file
├── index.ts                           # Schema file registry
├── schema-generator.ts                # Script to split schema into modules
├── schema.gql                         # Main schema (auto-generated, used by Apollo)
│
├── auth.gql                          # Authentication types and inputs
├── users.gql                         # User management
├── roles.gql                         # Role management
├── permissions.gql                   # Permission management
│
├── countries.gql                     # Country data
├── states.gql                        # State/province data
├── cities.gql                        # City data
│
├── master-data.gql                   # Master data configuration
├── profiles.gql                      # User profiles
├── user-profile-preferences.gql      # User profile preferences
│
├── subscription-plans.gql            # Subscription plan definitions
├── user-subscriptions.gql            # User subscription management
├── payments.gql                      # Payment processing
├── promo-codes.gql                   # Promotional codes
├── user-vouchers.gql                 # User vouchers
│
├── support-tickets.gql               # Support ticket system
├── support-messages.gql              # Support messages
├── profile-reports.gql               # Profile reporting
│
└── common.gql                        # Common types (DateTime, Query, Mutation)
```

## How It Works

1. **Auto-Generation**: NestJS GraphQL automatically generates `schema.gql` from TypeScript decorators
2. **Schema Splitting**: The `schema-generator.ts` script reads `schema.gql` and splits it into module-specific files
3. **Apollo Server**: Apollo Server uses the main `schema.gql` file for GraphQL execution
4. **Module Files**: Individual `.gql` files are for organization and reference only

## Commands

```bash
# Generate/regenerate modular schema files
npm run schema:split

# Start development (auto-generates schema.gql)
npm run start:dev
```

## Workflow

1. Define your types in TypeScript using NestJS GraphQL decorators
2. Start the dev server - NestJS generates `schema.gql`
3. Run `npm run schema:split` to create modular files
4. Modular files are created/updated in this directory

## Important Notes

- **DO NOT** manually edit any `.gql` files - they are auto-generated
- The main `schema.gql` is the source of truth used by Apollo Server
- Individual module `.gql` files are for organization and quick reference
- All `.gql` files are gitignored

## Adding New Modules

To add a new module to the schema splitter:

1. Open `schema-generator.ts`
2. Add your module to the `moduleMapping` object:
   ```typescript
   'your-module.gql': ['YourType', 'CreateYourInput', 'UpdateYourInput'],
   ```
3. Run `npm run schema:split`
