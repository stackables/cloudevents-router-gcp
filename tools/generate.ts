/* istanbul ignore file */

import axios from 'axios'
import path from 'path'
import fs = require('fs/promises')

export const source = 'https://raw.githubusercontent.com/googleapis/google-cloudevents/master/jsonschema/catalog.json'
const dest = path.join(__dirname, '..', 'src', 'generated.ts')

async function main() {
    const { data } = await axios.get<any>(source)

    const imports: string[] = []
    const output: string[] = ['export type GoogleEvents = {']

    data.schemas.forEach((schema: any) => {
        imports.push(`import { ${schema.name} } from '@${schema.datatype.replaceAll('.', '/')}'`)
        schema.cloudeventTypes.forEach((type: string) => {
            output.push(`  '${type}': ${schema.name}`)
        })
    })
    output.push(`}`)

    const finalFile = imports.join('\n') + '\n\n' + output.join('\n')

    await fs.writeFile(dest, finalFile)

    return `Generated Google events mapping to ${dest}`
}


if (require.main === module) {
    main().catch(console.error).then(console.log)
}