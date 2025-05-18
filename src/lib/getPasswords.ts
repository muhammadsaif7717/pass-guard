import axios from "axios";
import getURL from "./getURL";

export default async function getPasswords() {
  const url = await getURL();

  try {
    const res = await axios.get(`${url}/passwords/get`);
    return res.data;
  } catch (error) {
    console.error("Error fetching passwords:", error);
    throw new Error("Failed to fetch passwords");
  }
}
