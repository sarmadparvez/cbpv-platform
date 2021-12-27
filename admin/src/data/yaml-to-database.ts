import { getConnection } from 'typeorm';
import * as yaml from 'js-yaml';
import * as fs from 'fs';

/**
 * Insert a yaml file into database
 * @param fileName the name of the file in src/data
 */
export async function yamlToDatabase(fileName: string) {
  let records: any[] = [];
  let tableName: string;
  try {
    records = yaml.load(fs.readFileSync(`src/data/${fileName}`, 'utf8'));
    tableName = fileName.substring(0, fileName.indexOf('.yaml'));
  } catch (err) {
    console.log('error reading the yaml file', err);
  }
  if (!records || !tableName) {
    return;
  }
  const connection = getConnection();
  const data = [];
  records.forEach((record) => {
    data.push(record);
  });
  console.log('data ', data);
  if (data.length > 1) {
    await connection
      .createQueryBuilder()
      .insert()
      .into(tableName)
      .values(data)
      .execute();
  }
}
