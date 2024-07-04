import axios from "axios";
import hash from "object-hash";
import { source } from "../tools/generate";

test("GCP schema has not changed since last build", async () => {
	const { data } = await axios.get(source);
	expect(hash(data)).toBe("350009fecfc410ff8e956888119d9159b64e2041");
});
