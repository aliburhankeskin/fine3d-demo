export default function getAcceptLanguage(lang?: string) {
  switch (lang) {
    case "tr":
      return "tr-TR";
    case "en":
      return "en-US";
    default:
      return "tr-TR";
  }
}
