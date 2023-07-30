import axios from 'axios'
import hash from 'object-hash'
import { source } from '../tools/generate'

test('GCP schema has not changed since last build', async () => {
    const { data } = await axios.get(source)
    expect(hash(data)).toBe('87b4e944d85c8502c904513c15cd7095ddb87e4e')
})
