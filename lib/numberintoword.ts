export function numberToWords(num: number): string {
  const a = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];

  const b = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  const make = (n: number, s: string) =>
    n
      ? (n < 20
          ? a[n]
          : b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "")) +
        (s ? " " + s : "")
      : "";

  if (num === 0) return "zero";

  const parts = [
    make(Math.floor(num / 10000000), "crore"),
    make(Math.floor((num / 100000) % 100), "lakh"),
    make(Math.floor((num / 1000) % 100), "thousand"),
    make(Math.floor((num / 100) % 10), "hundred"),
  ];

  const remainder = num % 100;

  if (num > 100 && remainder) {
    parts.push("and");
  }

  parts.push(make(remainder, ""));

  return parts.filter(Boolean).join(" ").trim();
}
