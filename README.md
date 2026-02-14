# KIMPC Management System
## Kalilangan Irrigators Multi-Purpose Cooperative

A specialized ERP (Enterprise Resource Planning) system designed for the unique operational needs of an Irrigators Cooperative. This system manages multi-window accounting (Business vs. Irrigation), membership identities, and heavy equipment fleet usage.

### 🚀 Key Features
- **Bookkeeper Hub**: Comprehensive Chart of Accounts management, AI-powered receipt parsing, and General Ledger synchronization.
- **Treasurer Hub**: Real-time vault management, disbursement terminal, and automated collection tracking for Agri-supplies and Milling.
- **Secretary Hub**: Formal governance seat management, member onboarding, and institutional document archiving.
- **AI Analytics**: Integrated Gemini 3.0 Pro for financial health auditing and strategic cooperative recommendations.

### 🔐 Security & Roles
The system utilizes **Mirror Protocol** for administrative oversight:
1. **Admin**: Full system control and personnel access management.
2. **Bookkeeper**: Authorized to verify vouchers and manage the COA.
3. **Treasurer**: Authorized to release funds and manage physical cash.
4. **Secretary**: Authorized to manage member identities and governance records.

### 🛠 Tech Stack
- **Frontend**: React 19 (TypeScript)
- **Icons**: Lucide React
- **Database/Auth**: Supabase
- **Intelligence**: Google Gemini API (GenAI SDK)

### 📦 Setup Instructions
1. Clone the repository: `git clone [repository-url]`
2. Install dependencies: `npm install`
3. Create a `.env` file in the root directory.
4. Add your Gemini API Key: `API_KEY=your_key_here`
5. Start development: `npm run dev`

### 📋 SQL Schema Note
Ensure the `notifications` table is initialized with the correct RLS (Row Level Security) policies found in the `BackupRestore.tsx` repair script to enable the **Personnel Hub** broadcast feature.

---
*Confidentiality Notice: This system contains sensitive financial algorithms specific to KIMPC operations.*
