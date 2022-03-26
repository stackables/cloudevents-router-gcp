import axios from 'axios'
import hash from 'object-hash'
import { source } from '../tools/generate'

test('GCP schema has not changed since last build', async () => {
    const { data } = await axios.get(source)
    expect(hash(data)).toBe('aeb8316da57b02cb73f7381b088fdf72b9c9154c')
})
