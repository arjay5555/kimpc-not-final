
export type TransactionType = 'INCOME' | 'EXPENSE' | 'CONTRIBUTION' | 'DIVIDEND' | 'LOAN_REPAYMENT' | 'RENTAL_FEE' | 'LOAN_DISBURSEMENT' | 'FERTILIZER_SALE' | 'INTERNAL_TRANSFER' | 'COMMODITY_PURCHASE' | 'MILLING_FEE' | 'DRYING_FEE' | 'SHELLING_FEE' | 'IA_SUBSIDY' | 'WATER_TENDER_PAYMENT';
export type MemberClassification = 'REGULAR' | 'PREFERRED' | 'SHAREHOLDER';
export type EquipmentCondition = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
export type AssetCondition = 'New' | 'Good' | 'Fair' | 'Damaged';
export type AssetStatus = 'Available' | 'In Use / Assigned' | 'Under Repair' | 'Lost/Stolen' | 'Disposed';

export type LoanType = 'AGRICULTURAL' | 'PERSONAL' | 'EMERGENCY' | 'EDUCATIONAL' | 'BUSINESS';
export type LoanModality = 'CASH' | 'COMMODITY';
export type LoanStatus = 'PENDING' | 'ACTIVE' | 'OVERDUE' | 'CLOSED';

export type AccountingWindow = 'IRRIGATION' | 'BUSINESS';
export type FundCategory = 'GENERAL' | 'MORTUARY' | 'CDF' | 'RESERVE' | string;
export type BankInstitution = string;

export type AccountCategory = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'INCOME' | 'EXPENSE';

export enum UserRole {
  BOOKKEEPER = 'BOOKKEEPER',
  TREASURER = 'TREASURER',
  ADMIN = 'ADMIN',
  SECRETARY = 'SECRETARY',
  MEMBER = 'MEMBER'
}

export interface SystemNotification {
  id: string;
  timestamp: string;
  senderRole: UserRole;
  senderName: string;
  recipientRole: UserRole | 'ALL';
  message: string;
  type: 'MANDATE' | 'SYSTEM' | 'MESSAGE';
  read: boolean;
  priority: 'LOW' | 'NORMAL' | 'URGENT';
}

export interface Account {
  id: string;
  code: string;
  name: string;
  pillar: AccountCategory;
  category: string;
  subCategory: string;
}

export interface CoaCategoryDefinition {
  name: string;
  subCategories: string[];
}

export interface EquipmentLog {
  id: string;
  equipmentId: string;
  memberId?: string;
  nonMemberName?: string;
  isMember: boolean;
  date: string;
  hoursUsed: number;
  totalFee: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'PAID' | 'PENDING_HARVEST' | 'UNPAID';
  dueDate?: string;
}

export interface TransferRecord {
  date: string;
  user: UserRole | string;
  action: string;
  notes: string;
}

export interface ConfigAuditLog {
  id: string;
  date: string;
  user: UserRole;
  category: string;
  description: string;
}

export type SupplyCategory = 
  | 'Fertilizer' 
  | 'Chemical' 
  | 'Seeds' 
  | 'Tools'
  | 'Others';

export type SupplyUnit = 'Bottle' | 'Sack' | 'Pouch' | 'Kg' | 'Unit';

export interface Bank {
  id: string;
  name: string;
  image?: string;
  isSystem?: boolean;
}

export interface FarmPlot {
  hectares: number;
  crop: string;
  location: string;
}

export interface LoanRepayment {
  id: string;
  loanId: string;
  date: string;
  principalAmount: number;
  interestAmount: number;
  penaltyAmount: number;
  recordedBy: string;
}

export interface Loan {
  id: string;
  memberId: string;
  type: LoanType;
  modality: LoanModality; 
  window: AccountingWindow; 
  principal: number;
  interestRate: number; 
  termMonths: number;
  startDate: string;
  dueDate: string; 
  status: LoanStatus;
  repayments: LoanRepayment[];
  notes?: string;
}

export interface SupplyItem {
  id: string;
  name: string;
  type: SupplyCategory;
  brand?: string;
  stockLevel: number;
  unit: SupplyUnit;
  costPrice: number; 
  sellingPrice: number; 
  window: AccountingWindow;
  image?: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  category: string;
  amount: number;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  voidStatus?: 'NONE' | 'PENDING' | 'APPROVED'; 
  reconciled?: boolean; 
  recordedBy: string; 
  verifiedBy?: string; 
  handledBy?: string; 
  window: AccountingWindow;
  fundCategory: FundCategory;
  targetAccount: BankInstitution; 
  sourceAccount?: BankInstitution; 
  equipmentId?: string; 
  memberId?: string;
  loanId?: string; 
  payer?: string;       
  payee?: string;
  receiptImage?: string; 
  payeeTin?: string;
  accountCode: string; // Required for GL tracking
  accountName?: string;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email?: string;
  accessEmail?: string; 
  phone: string;
  birthDate: string;
  joinDate: string;
  shareCapital: number;
  savingsBalance: number;
  unpaidContribution: number; 
  status: 'ACTIVE' | 'INACTIVE' | 'DIED' | 'TRANSFERRED';
  classification: MemberClassification;
  farmPlots: FarmPlot[];
  sharesCount: number;
  profileImage?: string;
  tinNumber?: string;
  sex: 'MALE' | 'FEMALE' | 'OTHER';
  successorOf?: string; 
  sitio: string;
  barangay: string;
  municipality: string;
  province: string;
  role?: UserRole;
  position?: string; 
}

export interface Equipment {
  id: string;
  name: string;
  type: 'RENTAL' | 'FREE_MEMBER_USE';
  hourlyRate: number;
  nonMemberHourlyRate: number;
  status: 'AVAILABLE' | 'MAINTENANCE' | 'IN_USE';
  image?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  donor?: string;
  condition: EquipmentCondition;
  serialNumber?: string; 
}

export interface GlobalSettings {
  systemBranding: {
    backgroundUrl: string;
    coopName: string;
    logoUrl?: string;
  };
  honorariums: {
    waterTender: number;
    chairman: number;
    viceChairman: number;
    bod: number; 
    auditors: number; 
    secretary: number;
    treasurer: number;
    manager: number;
    bookkeeper: number;
    crecom: number;
    elecom: number;
    cook: number;
  };
  statutorySplits: {
    reserve: number;
    education: number;
    landBuilding: number;
    community: number;
  };
  dividendSplits: {
    shareCapitalInterest: number; 
    patronageRefund: number;      
  };
  interestRates: {
    agriSupplies: number;
    fleetManager: number;
    processingHub: number;
    cashLoan: number;
  };
  commissions: {
    collectorPercentage: number;
    loanServiceFee: number;
    riceMillOperatorPercentage: number;
    cornShellerOperatorPercentage: number;
    pesadorPercentage: number;
  };
  chartOfAccounts: Account[];
  coaHierarchy: Record<AccountCategory, CoaCategoryDefinition[]>;
}

export interface InventoryItem {
  id: string;
  name: string;
  assetTag: string;
  serialNumber: string;
  mainCategory: string;
  subCategory: string;
  prefixCode: string;
  location: string;
  status: AssetStatus;
  condition: AssetCondition;
  acquisitionMethod: 'Purchase' | 'Donation';
  purchaseDate: string;
  purchaseCost: number;
  estimatedMarketValue: number;
  vendor: string;
  fundingSource: string;
  lastAuditDate: string;
  notes: string;
  assignedTo?: string;
  transferHistory: TransferRecord[];
}
