import axios from 'axios'
import hash from 'object-hash'
import { source } from '../tools/generate'

test('GCP schema has not changed since last build', async () => {
    const { data } = await axios.get(source)
    expect(hash(data)).toBe('2934e6a84d0bb93a5e10313b053ff93f2b83c017')
})
