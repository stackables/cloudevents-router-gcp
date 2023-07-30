/* istanbul ignore file */

import axios from 'axios'
import path from 'path'
import fs = require('fs/promises')

export const source = 'https://raw.githubusercontent.com/googleapis/google-cloudevents/master/jsonschema/catalog.json'
const dest = path.join(__dirname, '..', 'src', 'generated.ts')

async function main() {
    const { data } = await axios.get<any>(source)

    const nameCache: Record<string, boolean> = {}
    const imports: string[] = []
    const output: string[] = ['export type GoogleEvents = {']

    function getShortName(name: string, counter = 0) {
        const nameOption = (counter > 0) ? `${name}${counter}` : name

        if (nameCache[nameOption]) {
            return getShortName(name, counter + 1)
        }

        nameCache[nameOption] = true
        return nameOption
    }

    for (let index = 0; index < data.schemas.length; index++) {
        const schema = data.schemas[index];

        try {

            await fs.stat(path.join(__dirname, '..', 'node_modules', '@' + schema.datatype.replaceAll('.', '/') + '.js'))

            const shortName = getShortName(schema.name)

            const asRename = (shortName !== schema.name) ? ` as ${shortName}` : ''

            imports.push(`import { ${schema.name}${asRename} } from '@${schema.datatype.replaceAll('.', '/')}'`)
            schema.cloudeventTypes.forEach((type: string) => {
                output.push(`  '${type}': ${shortName}`)
            })
        } catch (error: any) {
            // pass
        }
    }
    output.push(`}`)

    const finalFile = imports.join('\n') + '\n\n' + output.join('\n')

    await fs.writeFile(dest, finalFile)

    return `Generated Google events mapping to ${dest}`
}


if (require.main === module) {
    main().catch(console.error).then(console.log)
}