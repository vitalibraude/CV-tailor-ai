# CV Tailor AI 🎯

מערכת חכמה להתאמת קורות חיים למשרות באמצעות בינה מלאכותית (Google Gemini).

## ✨ תכונות

- 🤖 התאמה אוטומטית של קורות חיים לדרישות המשרה
- 📝 שינוי כותרות תפקידים להתאמה מושלמת
- 🎯 הוספת סקילים רלוונטיים מתוך דרישות המשרה
- 💬 שדה משוב לשיפורים בזמן אמת
- 📧 יצירת מכתב מקדים מותאם אישית
- 📥 הורדה כקבצי Word

## 🚀 התקנה והרצה

### דרישות מוקדמות
- Node.js (גרסה 16 ומעלה)
- Google Gemini API Key

### שלבי התקנה

1. **שכפול הפרויקט:**
   ```bash
   git clone https://github.com/vitalibraude/CV-tailor-ai.git
   cd CV-tailor-ai
   ```

2. **התקנת תלויות:**
   ```bash
   npm install
   ```

3. **הגדרת API Key:**
   - צור קובץ `.env` בתיקיית הפרויקט
   - העתק את התוכן מ-`.env.example`
   - קבל API key מ-[Google AI Studio](https://makersuite.google.com/app/apikey)
   - הדבק את המפתח בקובץ `.env`:
   ```
   VITE_API_KEY=your_gemini_api_key_here
   ```

4. **הרצת הפרויקט:**
   ```bash
   npm run dev
   ```

5. **גלוש לכתובת:** `http://localhost:3000`

## 📖 שימוש

1. הדבק את קורות החיים המקוריים שלך
2. הדבק את תיאור המשרה
3. לחץ על "התאם לי את קורות החיים"
4. קבל קורות חיים מותאמים אישית
5. השתמש בשדה המשוב לשיפורים נוספים
6. צור מכתב מקדים והורד הכל כ-Word

## 🛠️ טכנולוגיות

- React + TypeScript
- Vite
- Google Gemini AI
- Tailwind CSS
- docx (יצירת קבצי Word)
- Lucide Icons

## 📝 רישיון

MIT

## 👨‍💻 מפתח

Vitali Braude - [GitHub](https://github.com/vitalibraude)
