import axios from "axios";
import hash from "object-hash";
import { source } from "../tools/generate";

test("GCP schema has not changed since last build", async () => {
	const { data } = await axios.get(source);
	expect(hash(data)).toBe("b6fb2f83ab3539c2c5d888e6dcfbbfbc84455a8f");
});
