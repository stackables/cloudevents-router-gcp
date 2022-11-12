import axios from 'axios'
import hash from 'object-hash'
import { source } from '../tools/generate'

test('GCP schema has not changed since last build', async () => {
    const { data } = await axios.get(source)
    expect(hash(data)).toBe('de05661b0e8127ac497b26485b8a13cdafc3c69b')
})
