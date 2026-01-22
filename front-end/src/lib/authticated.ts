import { contactService } from "@/services/contact.service";
export default async function isAuthenticated() {
  try {
    const data = await contactService.isLoggedIn();
    return data;
  } catch (error) {
    console.log(error);
    return false;
  }
}
