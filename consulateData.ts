
export interface ConsulateItem {
  name: string;
  url: string;
  country: string; // For searching
  countryEn: string; // For searching
}

export interface PhoneItem {
  name: string;
  number: string;
  country: string;
  countryEn: string;
}

// Helper to map simplified/traditional characters or partial matches to English
const CN_TO_EN: Record<string, string> = {
  // Common Traditional & Simplified Mappings
  "巴西": "Brazil", "玻利維亞": "Bolivia", "厄瓜多爾": "Ecuador", "智利": "Chile", "哥倫比亞": "Colombia",
  "阿根廷": "Argentina", "秘魯": "Peru", "圭亞那": "Guyana", "蘇利南": "Suriname", "委內瑞拉": "Venezuela", "烏拉圭": "Uruguay",
  "德國": "Germany", "俄羅斯": "Russia", "法國": "France", "荷蘭": "Netherlands", "瑞典": "Sweden", "瑞士": "Switzerland",
  "烏克蘭": "Ukraine", "西班牙": "Spain", "義大利": "Italy", "英國": "United Kingdom UK", "羅馬尼亞": "Romania",
  "愛爾蘭": "Ireland", "奧地利": "Austria", "比利時": "Belgium", "冰島": "Iceland", "波蘭": "Poland",
  "丹麥": "Denmark", "芬蘭": "Finland", "捷克": "Czech Republic", "挪威": "Norway", "葡萄牙": "Portugal", "希臘": "Greece", "匈牙利": "Hungary",
  "加拿大": "Canada", "美國": "United States USA", "墨西哥": "Mexico",
  "阿聯酋": "United Arab Emirates UAE", "巴基斯坦": "Pakistan", "朝鮮": "North Korea", "菲律賓": "Philippines",
  "哈薩克": "Kazakhstan", "韓國": "South Korea", "吉爾吉斯": "Kyrgyzstan", "老撾": "Laos", "馬來西亞": "Malaysia",
  "蒙古": "Mongolia", "緬甸": "Myanmar", "日本": "Japan", "沙烏地阿拉伯": "Saudi Arabia", "泰國": "Thailand",
  "土耳其": "Turkey", "伊拉克": "Iraq", "伊朗": "Iran", "印度": "India", "印尼": "Indonesia", "越南": "Vietnam",
  "新加坡": "Singapore", "以色列": "Israel", "約旦": "Jordan", "斯里蘭卡": "Sri Lanka",
  "埃及": "Egypt", "澳大利亞": "Australia", "紐西蘭": "New Zealand"
};

// Updated raw data
const RAW_DATA = [
  ["駐澳大利亞聯邦大使館", "https://www.mfa.gov.cn/web/zwjg_674741/zwsg_674743/bmdyz_674755/200709/t20070912_7680179.shtml"],
  ["駐紐西蘭大使館", "https://www.mfa.gov.cn/web/zwjg_674741/zwsg_674743/bmdyz_674755/200512/t20051208_7680154.shtml"],
  ["駐加拿大大使館", "https://www.mfa.gov.cn/web/zwjg_674741/zwsg_674743/xybf_674751/200505/t20050527_7680087.shtml"],
  ["駐美利堅合眾國大使館", "https://www.mfa.gov.cn/web/zwjg_674741/zwsg_674743/xybf_674751/200505/t20050527_7680083.shtml"],
  ["駐巴西聯邦共和國大使館", "https://www.mfa.gov.cn/web/zwjg_674741/zwsg_674743/dozy_674753/200606/t20060609_7680149.shtml"],
  ["駐日本國大使館", "https://www.mfa.gov.cn/web/zwjg_674741/zwsg_674743/yz_674745/200505/t20050526_7679730.shtml"],
  ["駐泰王國大使館", "https://www.mfa.gov.cn/web/zwjg_674741/zwsg_674743/yz_674745/200902/t20090205_7679718.shtml"],
  ["駐新加坡共和國大使館", "https://www.mfa.gov.cn/web/zwjg_674741/zwsg_674743/yz_674745/200704/t20070402_7679700.shtml"],
  ["駐大不列顛及北愛爾蘭聯合王國大使館", "https://www.mfa.gov.cn/web/zwjg_674741/zwsg_674743/xo_674749/200704/t20070412_7680034.shtml"],
  ["駐德意志聯邦共和國大使館", "https://www.mfa.gov.cn/web/zwjg_674741/zwsg_674743/xo_674749/200801/t20080118_7680025.shtml"],
  ["駐法蘭西共和國大使館", "https://www.mfa.gov.cn/web/zwjg_674741/zwsg_674743/xo_674749/200803/t20080311_7680017.shtml"],
  ["駐葡萄牙共和國大使館", "https://www.mfa.gov.cn/web/zwjg_674741/zwsg_674743/xo_674749/200609/t20060915_7679979.shtml"]
];

const RAW_PHONE_DATA = [
  ["駐英國大使館", "+44-(0)2072998439"],
  ["駐德國大使館", "+49-3027588551"],
  ["駐法國大使館", "+33-153758840"],
  ["駐葡萄牙大使館", "+351-214024855"],
  ["駐澳大利亞大使館", "+61-2-62283948"],
  ["駐紐西蘭大使館", "+64-4-4995022"],
  ["駐日本大使館", "+81-3-34033064"],
  ["駐泰國大使館", "+66-2-2457010"],
  ["駐新加坡大使館", "+65-64750165"],
  ["駐加拿大大使館", "+1-613-5621616"],
  ["駐美國大使館", "+1-202-4952216"],
  ["駐巴西大使館", "+55-61-999816188"]
];

const parseCountryName = (title: string): string => {
  const bracketMatch = title.match(/（(.*?)）/);
  if (bracketMatch) {
    return bracketMatch[1];
  }
  let clean = title.replace(/^駐|^常駐|^中國/, '');
  clean = clean.replace(/大使館|總領事館|領事館|總領館|辦事處|代表處|使團|代表團|代辦處|領事辦公室|使館|領區/g, '');
  clean = clean.replace(/大使馆|总领事馆|领事馆|总领馆|办事处|代表处|使团|代表团|代办处|领事办公室|使馆|领区/g, '');
  clean = clean.replace(/共和國|聯邦|合眾國|聯合王國|民主社會主義|伊斯蘭|人民民主|民主|王國|獨立國|大公國|哈湊姆|斯坦|社會主義/g, ''); 
  clean = clean.replace(/共和国|联邦|合众国|联合王国|民主社会主义|伊斯兰|人民民主|民主|王国|独立国/g, ''); 
  clean = clean.replace(/\(.*\)/, '');
  return clean;
};

export const CONSULATE_DATA: ConsulateItem[] = RAW_DATA.map(([name, url]) => {
  const country = parseCountryName(name);
  const countryEn = CN_TO_EN[country] || ""; 
  
  return {
    name,
    url,
    country,
    countryEn
  };
});

export const PHONE_DATA: PhoneItem[] = RAW_PHONE_DATA.map(([name, number]) => {
  const country = parseCountryName(name);
  const countryEn = CN_TO_EN[country] || "";
  
  return {
    name,
    number,
    country,
    countryEn
  }
});