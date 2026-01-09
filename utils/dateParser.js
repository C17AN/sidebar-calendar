export function parseDates(text) {
  const dates = [];
  
  // Helper to normalize year
  const normalizeYear = (y) => {
    if (y.length === 2) {
      return `20${y}`; // Assume 20xx
    }
    return y;
  };

  // 1. ISO: YYYY-MM-DD, YYYY/MM/DD, YYYY.MM.DD
  const isoRegex = /\b(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})\b/g;
  let match;
  while ((match = isoRegex.exec(text)) !== null) {
    const year = match[1];
    const month = match[2].padStart(2, '0');
    const day = match[3].padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
  }

  // 2. Numeric: MM/DD/YYYY, DD/MM/YYYY, MM-DD-YY, etc.
  // Matches: 1-2 digits, separator, 1-2 digits, separator, 2 or 4 digits
  const numRegex = /\b(\d{1,2})[-/.](\d{1,2})[-/.](\d{2}|\d{4})\b/g;
  while ((match = numRegex.exec(text)) !== null) {
    let p1 = parseInt(match[1], 10);
    let p2 = parseInt(match[2], 10);
    const yearRaw = match[3];
    const year = normalizeYear(yearRaw);

    let month, day;

    // Logic to distinguish MM/DD from DD/MM
    if (p1 > 12) {
      // Must be DD/MM
      day = p1.toString().padStart(2, '0');
      month = p2.toString().padStart(2, '0');
    } else {
      // Ambiguous or MM/DD. Default to MM/DD (US)
      month = p1.toString().padStart(2, '0');
      day = p2.toString().padStart(2, '0');
    }

    const normalized = `${year}-${month}-${day}`;
    // Basic validation (e.g. month 0 or day 32) is handled by Date object check later, 
    // but we can check month > 12 here if p1 was month.
    if (parseInt(month) <= 12 && parseInt(day) <= 31) {
       if (!dates.includes(normalized)) dates.push(normalized);
    }
  }

  // 2.5 No Year: MM/DD, MM.DD, MM-DD
  // Default to current year.
  // Avoid matching parts of full dates (e.g. 2024-01-01 should not match 01-01)
  const currentYear = new Date().getFullYear();
  const noYearRegex = /\b(\d{1,2})[-/.](\d{1,2})\b/g;
  while ((match = noYearRegex.exec(text)) !== null) {
    const start = match.index;
    const end = start + match[0].length;
    
    // Check if part of a longer date sequence
    const prevChar = text[start - 1];
    const nextChar = text[end];
    const isSeparator = (c) => c === '-' || c === '/' || c === '.';
    
    if (isSeparator(prevChar) || isSeparator(nextChar)) {
      continue;
    }

    let p1 = parseInt(match[1], 10);
    let p2 = parseInt(match[2], 10);
    let month, day;

    if (p1 > 12) {
      // Must be DD/MM
      day = p1.toString().padStart(2, '0');
      month = p2.toString().padStart(2, '0');
    } else {
      // Default to MM/DD
      month = p1.toString().padStart(2, '0');
      day = p2.toString().padStart(2, '0');
    }

    if (parseInt(month) >= 1 && parseInt(month) <= 12 && parseInt(day) >= 1 && parseInt(day) <= 31) {
      const normalized = `${currentYear}-${month}-${day}`;
      if (!dates.includes(normalized)) dates.push(normalized);
    }
  }

  // 3. Text: Month DD, YYYY or DD Month YYYY
  // e.g. Jan 12, 2026, 12 January 2026, Feb 21, 2018
  const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const longMonthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  
  // FIXED: Double escaping for string RegExp
  // Matches: (Optional Day) (Month) (Optional Day), (Year)
  const allMonths = [...monthNames, ...longMonthNames].join('|');
  const textDateRegex = new RegExp(`\b(\d{1,2})?\s*(${allMonths})\s*(\d{1,2})?,?\s*(\d{2}|\d{4})\b`, 'gi');
  
  while ((match = textDateRegex.exec(text)) !== null) {
    const monthStr = match[2].toLowerCase();
    let monthIdx = monthNames.indexOf(monthStr.substring(0, 3));
    if (monthIdx === -1) monthIdx = longMonthNames.indexOf(monthStr);
    
    if (monthIdx !== -1) {
      const month = (monthIdx + 1).toString().padStart(2, '0');
      // Day is either before month (match[1]) or after month (match[3])
      const dayRaw = match[1] || match[3] || "01"; 
      const day = dayRaw.padStart(2, '0');
      const year = normalizeYear(match[4]);
      
      const normalized = `${year}-${month}-${day}`;
      if (!dates.includes(normalized)) dates.push(normalized);
    }
  }

  // Deduplicate and filter invalid dates
  return [...new Set(dates)].filter(d => !isNaN(new Date(d).getTime()));
}
