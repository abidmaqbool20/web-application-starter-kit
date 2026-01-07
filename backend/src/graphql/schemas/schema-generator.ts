import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const SCHEMA_PATH = join(process.cwd(), 'src/graphql/schemas/schema.gql');
const OUTPUT_DIR = join(process.cwd(), 'src/graphql/schemas');

// Module mapping based on type/input names
const moduleMapping: Record<string, string[]> = {
    'auth.gql': ['AuthResponseType', 'AuthUserType', 'LoginInput', 'RegisterInput'],
    'users.gql': ['UserType', 'CreateUserInput', 'UpdateUserInput'],
    'roles.gql': ['RoleType', 'CreateRoleInput', 'UpdateRoleInput'],
    'permissions.gql': ['PermissionType', 'CreatePermissionInput', 'UpdatePermissionInput'],
    'countries.gql': ['CountryType', 'CreateCountryInput', 'UpdateCountryInput'],
    'states.gql': ['StateType', 'CreateStateInput', 'UpdateStateInput'],
    'cities.gql': ['CityType', 'CreateCityInput', 'UpdateCityInput'],
    'master-data.gql': ['MasterDataType', 'CreateMasterDataInput', 'UpdateMasterDataInput'],
    'profiles.gql': ['ProfileType', 'CreateProfileInput', 'UpdateProfileInput'],
    'subscription-plans.gql': ['SubscriptionPlanType', 'CreateSubscriptionPlanInput', 'UpdateSubscriptionPlanInput'],
    'user-subscriptions.gql': ['UserSubscriptionType', 'CreateUserSubscriptionInput', 'UpdateUserSubscriptionInput'],
    'payments.gql': ['PaymentType', 'CreatePaymentInput', 'UpdatePaymentInput'],
    'promo-codes.gql': ['PromoCodeType', 'CreatePromoCodeInput', 'UpdatePromoCodeInput'],
    'user-vouchers.gql': ['UserVoucherType', 'CreateUserVoucherInput', 'UpdateUserVoucherInput'],
    'support-tickets.gql': ['SupportTicketType', 'CreateSupportTicketInput', 'UpdateSupportTicketInput'],
    'support-messages.gql': ['SupportMessageType', 'CreateSupportMessageInput', 'UpdateSupportMessageInput'],
    'profile-reports.gql': ['ProfileReportType', 'CreateProfileReportInput', 'UpdateProfileReportInput'],
    'user-profile-preferences.gql': ['UserProfilePreferenceType', 'CreateUserProfilePreferenceInput', 'UpdateUserProfilePreferenceInput'],
};

function splitSchema() {
    try {
        const schemaContent = readFileSync(SCHEMA_PATH, 'utf-8');
        const lines = schemaContent.split('\n');

        const moduleSchemas: Record<string, string[]> = {};
        let currentType = '';
        let currentBlock: string[] = [];
        let isInBlock = false;

        // Initialize all modules
        Object.keys(moduleMapping).forEach(module => {
            moduleSchemas[module] = [];
        });

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Check if this is a type/input declaration
            if (line.match(/^(type|input|enum)\s+(\w+)/)) {
                // Save previous block if exists
                if (isInBlock && currentType) {
                    saveBlockToModule(currentType, currentBlock, moduleSchemas);
                }

                const match = line.match(/^(type|input|enum)\s+(\w+)/);
                currentType = match ? match[2] : '';
                currentBlock = [line];
                isInBlock = true;
            } else if (isInBlock) {
                currentBlock.push(line);

                // Check if block ended
                if (line.trim() === '}' || (line.trim() === '' && currentBlock.length > 1)) {
                    if (line.trim() === '}') {
                        saveBlockToModule(currentType, currentBlock, moduleSchemas);
                        currentBlock = [];
                        isInBlock = false;
                        currentType = '';
                    }
                }
            }
        }

        // Save last block if exists
        if (isInBlock && currentType) {
            saveBlockToModule(currentType, currentBlock, moduleSchemas);
        }

        // Write module files
        Object.entries(moduleSchemas).forEach(([filename, content]) => {
            if (content.length > 0) {
                const header = '# ------------------------------------------------------\n' +
                              '# THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)\n' +
                              '# ------------------------------------------------------\n\n';
                writeFileSync(
                    join(OUTPUT_DIR, filename),
                    header + content.join('\n\n')
                );
                console.log(`Generated ${filename}`);
            }
        });

        // Generate index file
        generateIndexFile(Object.keys(moduleSchemas).filter(m => moduleSchemas[m].length > 0));

        console.log('Schema splitting completed successfully!');
    } catch (error) {
        console.error('Error splitting schema:', error);
        process.exit(1);
    }
}

function saveBlockToModule(typeName: string, block: string[], moduleSchemas: Record<string, string[]>) {
    for (const [module, types] of Object.entries(moduleMapping)) {
        if (types.includes(typeName)) {
            moduleSchemas[module].push(block.join('\n'));
            return;
        }
    }

    // If not found in mapping, put in common.gql
    if (!moduleSchemas['common.gql']) {
        moduleSchemas['common.gql'] = [];
    }
    moduleSchemas['common.gql'].push(block.join('\n'));
}

function generateIndexFile(modules: string[]) {
    const imports = modules
        .map(module => `# Import ${module}\n# Included in main schema generation`)
        .join('\n\n');

    const content = `# ------------------------------------------------------
# GraphQL Schema Index
# ------------------------------------------------------
# This file lists all module schemas.
# The main schema.gql file is auto-generated and contains
# all types. Individual module files are split for reference.

${imports}

# Usage:
# - Main schema: schema.gql (used by Apollo Server)
# - Module schemas: Individual .gql files (for reference/organization)
`;

    writeFileSync(join(OUTPUT_DIR, 'README.md'), content);
    console.log('Generated README.md');
}

// Run the splitter
splitSchema();
