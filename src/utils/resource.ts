import * as Linking from "expo-linking";

export async function openResource(url: string) {
  const supported = await Linking.canOpenURL(url);

  if (!supported) {
    throw new Error("Cannot open file.");
  }

  await Linking.openURL(url);
}