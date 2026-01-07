import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { MasterData } from '../modules/master_data/entities/master_data.entity';
import { buildDbConfig } from '../config/db.config';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
const dataSource = new DataSource(buildDbConfig(process.env) as DataSourceOptions);

/**
 * Generate a machine-readable key from value
 */
function generateKey(value: string): string {
   return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_');
}

/**
 * Master Data Seeder
 * Seeds the master_data table with dropdown values for the application
 */
export async function seed() {
   await dataSource.initialize();
   const repository = dataSource.getRepository(MasterData);

   // Check if data already exists
   const existingCount = await repository.count();
   if (existingCount > 0) {
      console.log('Master data already seeded. Skipping...');
      await dataSource.destroy();
      return;
   }

   console.log('Seeding master data...');

   const masterData: Partial<MasterData>[] = [


      { category: 'religion', key: 'muslim', value: 'Muslim', sortOrder: 1, isActive: true },
      { category: 'religion', key: 'hindu', value: 'Hindu', sortOrder: 2, isActive: true },
      { category: 'religion', key: 'christian', value: 'Christian', sortOrder: 3, isActive: true },
      { category: 'religion', key: 'sikh', value: 'Sikh', sortOrder: 4, isActive: true },
      { category: 'religion', key: 'buddhist', value: 'Buddhist', sortOrder: 5, isActive: true },
      { category: 'religion', key: 'jain', value: 'Jain', sortOrder: 6, isActive: true },
      { category: 'religion', key: 'parsi', value: 'Parsi', sortOrder: 7, isActive: true },
      { category: 'religion', key: 'jewish', value: 'Jewish', sortOrder: 8, isActive: true },

      { category: 'hobbies', key: 'reading', value: 'Reading', sortOrder: 1, isActive: true },
      { category: 'hobbies', key: 'traveling', value: 'Traveling', sortOrder: 2, isActive: true },
      { category: 'hobbies', key: 'fitness', value: 'Fitness / Gym', sortOrder: 3, isActive: true },
      { category: 'hobbies', key: 'music', value: 'Music', sortOrder: 4, isActive: true },
      { category: 'hobbies', key: 'movies', value: 'Movies', sortOrder: 5, isActive: true },
      { category: 'hobbies', key: 'cooking', value: 'Cooking', sortOrder: 6, isActive: true },
      { category: 'hobbies', key: 'sports', value: 'Sports', sortOrder: 7, isActive: true },


   ];


   // Insert all master data
   const entities = masterData.map((item) => repository.create(item));
   await repository.save(entities);

   console.log(`✅ Seeded ${masterData.length} master data entries.`);
   await dataSource.destroy();
}

// Allow running directly
if (require.main === module) {
   seed()
      .then(() => process.exit(0))
      .catch((err) => {
         console.error('Error seeding master data:', err);
         process.exit(1);
      });
}
