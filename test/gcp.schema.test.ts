import axios from 'axios'
import { source } from '../tools/generate'
import hash from 'object-hash'

test('GCP schema has not changed since last build', async () => {
    const { data } = await axios.get(source)
    expect(hash(data)).toBe('cd20623b13eed1c0d753ba261f1244c7f229d615')
})
