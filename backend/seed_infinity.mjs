import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tradeverse';

const stockSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  change: { type: Number, default: 0 },
  volume: { type: String, default: '0M' },
  ltp: { type: Number, required: true }
});

const Stock = mongoose.model('Stock', stockSchema);

const s1Set = [
  { symbol: 'ABB', name: 'ABB India' }, { symbol: 'ACC', name: 'ACC Ltd' }, { symbol: 'ADANIENT', name: 'Adani Enterprises' },
  { symbol: 'ADANIPORTS', name: 'Adani Ports' }, { symbol: 'ADANIPOWER', name: 'Adani Power' }, { symbol: 'AMBUJACEM', name: 'Ambuja Cements' },
  { symbol: 'APOLLOHOSP', name: 'Apollo Hospitals' }, { symbol: 'APOLLOTYRE', name: 'Apollo Tyres' }, { symbol: 'ASHOKLEY', name: 'Ashok Leyland' },
  { symbol: 'ASIANPAINT', name: 'Asian Paints' }, { symbol: 'ASTRAL', name: 'Astral Ltd' }, { symbol: 'ATGL', name: 'Adani Total Gas' },
  { symbol: 'AUBANK', name: 'AU Small Finance' }, { symbol: 'AUROPHARMA', name: 'Aurobindo Pharma' }, { symbol: 'AXISBANK', name: 'Axis Bank' },
  { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto' }, { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv' }, { symbol: 'BAJFINANCE', name: 'Bajaj Finance' },
  { symbol: 'BALKRISIND', name: 'Balkrishna Ind' }, { symbol: 'BANDHANBNK', name: 'Bandhan Bank' }, { symbol: 'BANKBARODA', name: 'Bank of Baroda' },
  { symbol: 'BEL', name: 'Bharat Electronics' }, { symbol: 'BHEL', name: 'BHEL' }, { symbol: 'BIOCON', name: 'Biocon Ltd' },
  { symbol: 'BPCL', name: 'BPCL' }, { symbol: 'BRITANNIA', name: 'Britannia Ind' }, { symbol: 'BSOFT', name: 'Birlasoft' },
  { symbol: 'CANBK', name: 'Canara Bank' }, { symbol: 'CDSL', name: 'CDSL' }, { symbol: 'CHOLAFIN', name: 'Cholamandalam' },
  { symbol: 'CIPLA', name: 'Cipla Ltd' }, { symbol: 'COALINDIA', name: 'Coal India' }, { symbol: 'COFORGE', name: 'Coforge Ltd' },
  { symbol: 'COLPAL', name: 'Colgate-Palmolive' }, { symbol: 'CONCOR', name: 'CONCOR' }, { symbol: 'COROMANDEL', name: 'Coromandel Int' },
  { symbol: 'CROMPTON', name: 'Crompton Greaves' }, { symbol: 'CUMMINSIND', name: 'Cummins India' }, { symbol: 'DABUR', name: 'Dabur India' },
  { symbol: 'DALBHARAT', name: 'Dalmia Bharat' }, { symbol: 'DEEPAKNTR', name: 'Deepak Nitrite' }, { symbol: 'DELHIVERY', name: 'Delhivery Ltd' },
  { symbol: 'DIVISLAB', name: 'Divis Labs' }, { symbol: 'DIXON', name: 'Dixon Tech' }, { symbol: 'DLF', name: 'DLF Ltd' },
  { symbol: 'DRREDDY', name: 'Dr Reddys Labs' }, { symbol: 'EICHERMOT', name: 'Eicher Motors' }, { symbol: 'ESCORTS', name: 'Escorts Kubota' },
  { symbol: 'EXIDEIND', name: 'Exide Industries' }, { symbol: 'FEDERALBNK', name: 'Federal Bank' }, { symbol: 'FORTIS', name: 'Fortis Healthcare' },
  { symbol: 'GAIL', name: 'GAIL India' }, { symbol: 'GLENMARK', name: 'Glenmark Pharma' }, { symbol: 'GMRINFRA', name: 'GMR Infrastructure' },
  { symbol: 'GODREJCP', name: 'Godrej Consumer' }, { symbol: 'GODREJPROP', name: 'Godrej Properties' }, { symbol: 'GRANULES', name: 'Granules India' },
  { symbol: 'GRASIM', name: 'Grasim Industries' }, { symbol: 'GUJGASLTD', name: 'Gujarat Gas' }, { symbol: 'HAL', name: 'Hindustan Aero' },
  { symbol: 'HAVELLS', name: 'Havells India' }, { symbol: 'HCLTECH', name: 'HCL Tech' }, { symbol: 'HDFCBANK', name: 'HDFC Bank' },
  { symbol: 'HDFCLIFE', name: 'HDFC Life' }, { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp' }, { symbol: 'HINDALCO', name: 'Hindalco Ind' },
  { symbol: 'HINDCOPPER', name: 'Hindustan Copper' }, { symbol: 'HINDPETRO', name: 'HPCL' }, { symbol: 'HINDUNILVR', name: 'Hindustan Unilever' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank' }, { symbol: 'ICICIGI', name: 'ICICI Lombard' }, { symbol: 'ICICIPRULI', name: 'ICICI Pru Life' },
  { symbol: 'IDFC', name: 'IDFC Ltd' }, { symbol: 'IDFCFIRSTB', name: 'IDFC First Bank' }, { symbol: 'IEX', name: 'IEX' },
  { symbol: 'IGL', name: 'Indraprastha Gas' }, { symbol: 'INDHOTEL', name: 'Indian Hotels' }, { symbol: 'INDIANB', name: 'Indian Bank' },
  { symbol: 'INDIGO', name: 'InterGlobe Aviat' }, { symbol: 'INDUSINDBK', name: 'IndusInd Bank' }, { symbol: 'INDUSTOWER', name: 'Indus Towers' },
  { symbol: 'INFY', name: 'Infosys Ltd' }, { symbol: 'IOC', name: 'Indian Oil' }, { symbol: 'IRCTC', name: 'IRCTC Ltd' },
  { symbol: 'IRFC', name: 'IRFC Ltd' }, { symbol: 'ITC', name: 'ITC Ltd' }, { symbol: 'JINDALSTEL', name: 'Jindal Steel' },
  { symbol: 'JSL', name: 'Jindal Stainless' }, { symbol: 'JSWENERGY', name: 'JSW Energy' }, { symbol: 'JSWSTEEL', name: 'JSW Steel' },
  { symbol: 'JUBLFOOD', name: 'Jubilant Food' }, { symbol: 'KALYANKJIL', name: 'Kalyan Jewellers' }, { symbol: 'KEC', name: 'KEC International' },
  { symbol: 'KEI', name: 'KEI Industries' }, { symbol: 'KOTAKBANK', name: 'Kotak Mahindra' }, { symbol: 'KPITTECH', name: 'KPIT Tech' },
  { symbol: 'L&TFH', name: 'L&T Finance' }, { symbol: 'LICHSGFIN', name: 'LIC Housing Fin' }, { symbol: 'LICI', name: 'LIC of India' },
  { symbol: 'LTIM', name: 'LTIMindtree' }, { symbol: 'LTTS', name: 'L&T Tech Services' }, { symbol: 'LUPIN', name: 'Lupin Ltd' },
  { symbol: 'M&M', name: 'M&M' }, { symbol: 'M&MFIN', name: 'M&M Finance' }, { symbol: 'MANAPPURAM', name: 'Manappuram Finance' },
  { symbol: 'MARICO', name: 'Marico Ltd' }, { symbol: 'MARUTI', name: 'Maruti Suzuki' }, { symbol: 'MAZDOCK', name: 'Mazagon Dock' },
  { symbol: 'MCDOWELL-N', name: 'United Spirits' }, { symbol: 'MCX', name: 'Multi Commodity' }, { symbol: 'METROPOLIS', name: 'Metropolis Health' },
  { symbol: 'MGL', name: 'Mahanagar Gas' }, { symbol: 'MPHASIS', name: 'Mphasis Ltd' }, { symbol: 'MRF', name: 'MRF Ltd' },
  { symbol: 'MUTHOOTFIN', name: 'Muthoot Finance' }, { symbol: 'NATIONALUM', name: 'NALCO' }, { symbol: 'NAUKRI', name: 'Info Edge' },
  { symbol: 'NAVINFLUOR', name: 'Navin Fluorine' }, { symbol: 'NESTLEIND', name: 'Nestle India' }, { symbol: 'NMDC', name: 'NMDC Ltd' },
  { symbol: 'NTPC', name: 'NTPC Ltd' }, { symbol: 'NYKAA', name: 'Nykaa' }, { symbol: 'OBEROIRLTY', name: 'Oberoi Realty' },
  { symbol: 'ONGC', name: 'ONGC' }, { symbol: 'PAGEIND', name: 'Page Industries' }, { symbol: 'PAYTM', name: 'Paytm' },
  { symbol: 'PEL', name: 'Piramal Ent' }, { symbol: 'PERSISTENT', name: 'Persistent Systems' }, { symbol: 'PETRONET', name: 'Petronet LNG' },
  { symbol: 'PFC', name: 'PFC' }, { symbol: 'PHOENIXLTD', name: 'Phoenix Mills' }, { symbol: 'PIDILITIND', name: 'Pidilite Ind' },
  { symbol: 'PIIND', name: 'PI Industries' }, { symbol: 'PNB', name: 'PNB' }, { symbol: 'POLYCAB', name: 'Polycab India' },
  { symbol: 'POONAWALLA', name: 'Poonawalla Fin' }, { symbol: 'POWERGRID', name: 'Power Grid' }, { symbol: 'PRESTIGE', name: 'Prestige Estates' },
  { symbol: 'RAINBOW', name: 'Rainbow Medicare' }, { symbol: 'RAMCOCEM', name: 'Ramco Cements' }, { symbol: 'RATNAMANI', name: 'Ratnamani Metals' },
  { symbol: 'RAYMOND', name: 'Raymond Ltd' }, { symbol: 'RECLTD', name: 'REC Ltd' }, { symbol: 'RELIANCE', name: 'Reliance Ind' },
  { symbol: 'RVNL', name: 'RVNL' }, { symbol: 'SAIL', name: 'SAIL' }, { symbol: 'SBICARD', name: 'SBI Cards' },
  { symbol: 'SBILIFE', name: 'SBI Life Insurance' }, { symbol: 'SBIN', name: 'State Bank of India' }, { symbol: 'SCHAEFFLER', name: 'Schaeffler India' },
  { symbol: 'SHREECEM', name: 'Shree Cement' }, { symbol: 'SHRIRAMFIN', name: 'Shriram Finance' }, { symbol: 'SIEMENS', name: 'Siemens Ltd' },
  { symbol: 'SKFINDIA', name: 'SKF India' }, { symbol: 'SONACOMS', name: 'Sona BLW' }, { symbol: 'SRF', name: 'SRF Ltd' },
  { symbol: 'STARHEALTH', name: 'Star Health' }, { symbol: 'SUNPHARMA', name: 'Sun Pharma' }, { symbol: 'SUNTV', name: 'Sun TV' },
  { symbol: 'SUPREMEIND', name: 'Supreme Ind' }, { symbol: 'SYNGENE', name: 'Syngene Int' }, { symbol: 'TATACHEM', name: 'Tata Chemicals' },
  { symbol: 'TATACOMM', name: 'Tata Comm' }, { symbol: 'TATACONSUM', name: 'Tata Consumer' }, { symbol: 'TATAELXSI', name: 'Tata Elxsi' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors' }, { symbol: 'TATAPOWER', name: 'Tata Power' }, { symbol: 'TATASTEEL', name: 'Tata Steel' },
  { symbol: 'TCS', name: 'TCS' }, { symbol: 'TECHM', name: 'Tech Mahindra' }, { symbol: 'THERMAX', name: 'Thermax Ltd' },
  { symbol: 'TITAN', name: 'Titan Company' }, { symbol: 'TORNTPHARM', name: 'Torrent Pharma' }, { symbol: 'TRENT', name: 'Trent Ltd' },
  { symbol: 'TRIDENT', name: 'Trident Ltd' }, { symbol: 'TRITURBINE', name: 'Triveni Turbine' }, { symbol: 'TIINDIA', name: 'Tube Investments' },
  { symbol: 'UBL', name: 'United Breweries' }, { symbol: 'ULTRACEMCO', name: 'UltraTech Cement' }, { symbol: 'UNIONBANK', name: 'Union Bank' },
  { symbol: 'UNOMINDA', name: 'Uno Minda' }, { symbol: 'UPL', name: 'UPL Ltd' }, { symbol: 'VBL', name: 'Varun Beverages' },
  { symbol: 'VEDL', name: 'Vedanta Ltd' }, { symbol: 'VOLTAS', name: 'Voltas Ltd' }, { symbol: 'WHIRLPOOL', name: 'Whirlpool India' },
  { symbol: 'WIPRO', name: 'Wipro Ltd' }, { symbol: 'YESBANK', name: 'Yes Bank' }, { symbol: 'ZEEL', name: 'Zee Ent' },
  { symbol: 'ZOMATO', name: 'Zomato Ltd' },
  { symbol: '360ONE', name: '360 ONE WAM' }, { symbol: '3MINDIA', name: '3M India' }, { symbol: 'ABFRL', name: 'Aditya Birla Fashion' },
  { symbol: 'ABSLAMC', name: 'Aditya Birla AMC' }, { symbol: 'AEGISCHEM', name: 'Aegis Logistics' }, { symbol: 'AETHER', name: 'Aether Industries' },
  { symbol: 'AFFLE', name: 'Affle India' }, { symbol: 'AJANTPHARM', name: 'Ajanta Pharma' }, { symbol: 'AKZOINDIA', name: 'Akzo Nobel' },
  { symbol: 'ALKYLAMINE', name: 'Alkyl Amines' }, { symbol: 'ALLCARGO', name: 'Allcargo Logistics' }, { symbol: 'ALOKINDS', name: 'Alok Industries' },
  { symbol: 'AMARAJABAT', name: 'Amara Raja Energy' }, { symbol: 'AMBER', name: 'Amber Enterprises' }, { symbol: 'ANGELONE', name: 'Angel One' },
  { symbol: 'ANURAS', name: 'Anupam Rasayan' }, { symbol: 'APARINDS', name: 'Apar Industries' }, { symbol: 'APTUS', name: 'Aptus Value Housing' },
  { symbol: 'ASAHIINDIA', name: 'Asahi India Glass' }, { symbol: 'ASHOKA', name: 'Ashoka Buildcon' }, { symbol: 'AVANTIFEED', name: 'Avanti Feeds' },
  { symbol: 'BAJAJELEC', name: 'Bajaj Electricals' }, { symbol: 'BAJAJHLDNG', name: 'Bajaj Holdings' }, { symbol: 'BALAMINES', name: 'Balaji Amines' },
  { symbol: 'BALMLAWRIE', name: 'Balmer Lawrie' }, { symbol: 'BALRAMCHIN', name: 'Balrampur Chini' }, { symbol: 'BAYERCROP', name: 'Bayer CropScience' },
  { symbol: 'BBTC', name: 'Bombay Burmah' }, { symbol: 'BDL', name: 'Bharat Dynamics' }, { symbol: 'BEML', name: 'BEML Ltd' },
  { symbol: 'BHARATFORG', name: 'Bharat Forge' }, { symbol: 'BHARATRAS', name: 'Bharat Rasayan' }, { symbol: 'BIRLACORPN', name: 'Birla Corp' },
  { symbol: 'BLS', name: 'BLS International' }, { symbol: 'BLUESTARCO', name: 'Blue Star' }, { symbol: 'BORORENEW', name: 'Borosil Renewables' },
  { symbol: 'BRIGADE', name: 'Brigade Enterprises' }, { symbol: 'CAMPUS', name: 'Campus Activewear' }, { symbol: 'CAPLIPOINT', name: 'Caplin Point' },
  { symbol: 'CARBORUNIV', name: 'Carborundum Uni' }, { symbol: 'CEATLTD', name: 'CEAT Ltd' }, { symbol: 'CENTRALBK', name: 'Central Bank' },
  { symbol: 'CENTURYPLY', name: 'Century Plyboards' }, { symbol: 'CENTURYTEX', name: 'Century Textiles' }, { symbol: 'CERA', name: 'Cera Sanitaryware' },
  { symbol: 'CESC', name: 'CESC Ltd' }, { symbol: 'CGPOWER', name: 'CG Power' }, { symbol: 'CHAMBLFERT', name: 'Chambal Fert' },
  { symbol: 'CLEAN', name: 'Clean Science' }, { symbol: 'CMSINFO', name: 'CMS Info Systems' }, { symbol: 'COCHINSHIP', name: 'Cochin Shipyard' },
  { symbol: 'CRISIL', name: 'CRISIL Ltd' }, { symbol: 'CSBBANK', name: 'CSB Bank' }, { symbol: 'CYIENT', name: 'Cyient Ltd' },
  { symbol: 'DATAPATTNS', name: 'Data Patterns' }, { symbol: 'DCBBANK', name: 'DCB Bank' }, { symbol: 'DCMSHRIRAM', name: 'DCM Shriram' },
  { symbol: 'DELTACORP', name: 'Delta Corp' }, { symbol: 'DEVYANI', name: 'Devyani International' }, { symbol: 'DHANI', name: 'Dhani Services' },
  { symbol: 'DODLA', name: 'Dodla Dairy' }, { symbol: 'EASEMYTRIP', name: 'Easy Trip Planners' }, { symbol: 'EIDPARRY', name: 'EID Parry' },
  { symbol: 'EIHOTEL', name: 'EIH Ltd' }, { symbol: 'ELGIEQUIP', name: 'Elgi Equipments' }, { symbol: 'EMAMILTD', name: 'Emami Ltd' },
  { symbol: 'ENDURANCE', name: 'Endurance Tech' }, { symbol: 'ENGINERSIN', name: 'Engineers India' }, { symbol: 'EPL', name: 'EPL Ltd' },
  { symbol: 'ERIS', name: 'Eris Lifesciences' }, { symbol: 'ESABINDIA', name: 'ESAB India' }, { symbol: 'ETHOSLTD', name: 'Ethos Ltd' },
  { symbol: 'EVEREADY', name: 'Eveready Industries' }, { symbol: 'FACT', name: 'Fert & Chem Travancore' }, { symbol: 'FDC', name: 'FDC Ltd' },
  { symbol: 'FINCABLES', name: 'Finolex Cables' }, { symbol: 'FINEORG', name: 'Fine Organic' }, { symbol: 'FINPIPE', name: 'Finolex Industries' },
  { symbol: 'FLUOROCHEM', name: 'Gujarat Fluorochem' }, { symbol: 'FSL', name: 'Firstsource Sol' }, { symbol: 'GABRIEL', name: 'Gabriel India' },
  { symbol: 'GARFIBRES', name: 'Garware Tech' }, { symbol: 'GENUSPOWER', name: 'Genus Power' }, { symbol: 'GODFRYPHLP', name: 'Godfrey Phillips' },
  { symbol: 'GPPL', name: 'Gujarat Pipavav' }, { symbol: 'GRSE', name: 'Garden Reach' }, { symbol: 'GSFC', name: 'GSFC' },
  { symbol: 'GSPL', name: 'Gujarat State Petronet' }, { symbol: 'GULFOILLUB', name: 'Gulf Oil Lubricants' }, { symbol: 'HAPPSTMNDS', name: 'Happiest Minds' },
  { symbol: 'HBLPOWER', name: 'HBL Power Systems' }, { symbol: 'HCC', name: 'HCC Ltd' }, { symbol: 'HCG', name: 'HealthCare Global' },
  { symbol: 'HFCL', name: 'HFCL Ltd' }, { symbol: 'HGINFRA', name: 'H.G. Infra' }, { symbol: 'HIKAL', name: 'Hikal Ltd' },
  { symbol: 'HINDZINC', name: 'Hindustan Zinc' }, { symbol: 'HONAUT', name: 'Honeywell Automation' }, { symbol: 'HUDCO', name: 'HUDCO' },
  { symbol: 'IDBI', name: 'IDBI Bank' }, { symbol: 'IIFL', name: 'IIFL Finance' },
  { symbol: 'INDIACEM', name: 'India Cements' }, { symbol: 'INDIAGLYCO', name: 'India Glycols' }, { symbol: 'INDIGOPNTS', name: 'Indigo Paints' },
  { symbol: 'INDOSTAR', name: 'IndoStar Capital' }, { symbol: 'INFIBEAM', name: 'Infibeam Avenues' }, { symbol: 'INGERRAND', name: 'Ingersoll-Rand' },
  { symbol: 'INOXGREEN', name: 'Inox Green' }, { symbol: 'INOXWIND', name: 'Inox Wind' }, { symbol: 'INTELLECT', name: 'Intellect Design' },
  { symbol: 'IONEXCHANG', name: 'Ion Exchange' }, { symbol: 'IRBINVRAF', name: 'IRB InvIT Fund' }, { symbol: 'ISGEC', name: 'Isgec Heavy Eng' },
  { symbol: 'ITI', name: 'ITI Ltd' }, { symbol: 'J&KBANK', name: 'J&K Bank' }, { symbol: 'JAGRAN', name: 'Jagran Prakashan' },
  { symbol: 'JAMNAAUTO', name: 'Jamna Auto' }, { symbol: 'JBCHEPHARM', name: 'JB Chemicals' }, { symbol: 'JBMA', name: 'JBM Auto' },
  { symbol: 'JINDALPOLY', name: 'Jindal Poly Films' }, { symbol: 'JINDALSAW', name: 'Jindal Saw' }, { symbol: 'JINDWORLD', name: 'Jindal Worldwide' },
  { symbol: 'JISLJALEQS', name: 'Jain Irrigation' }, { symbol: 'JKPAPER', name: 'JK Paper' }, { symbol: 'JKTYRE', name: 'JK Tyre' },
  { symbol: 'JMFINANCIL', name: 'JM Financial' }, { symbol: 'JSWHL', name: 'JSW Holdings' }, { symbol: 'JTEKTINDIA', name: 'JTEKT India' },
  { symbol: 'JUSTDIAL', name: 'Just Dial' }, { symbol: 'JYOTHYLAB', name: 'Jyothy Labs' }, { symbol: 'KAJARIACER', name: 'Kajaria Ceramics' },
  { symbol: 'KANSAINER', name: 'Kansai Nerolac' }, { symbol: 'KARURVYSYA', name: 'KARUR VYSYA' }, { symbol: 'KAYNES', name: 'Kaynes Tech' },
  { symbol: 'KESORAMIND', name: 'Kesoram Ind' }, { symbol: 'KFINTECH', name: 'KFin Tech' }, { symbol: 'KIMS', name: 'KIMS Hospitals' },
  { symbol: 'KIRLFER', name: 'Kirloskar Ferrous' }, { symbol: 'KIRLOSENG', name: 'Kirloskar Oil Eng' }, { symbol: 'KIRLOSIND', name: 'Kirloskar Ind' },
  { symbol: 'KIRLOSPNU', name: 'Kirloskar Pneu' }, { symbol: 'KNRCON', name: 'KNR Construction' }, { symbol: 'KOKUYO', name: 'Kokuyo Camlin' },
  { symbol: 'KOLTEPATIL', name: 'Kolte-Patil' }, { symbol: 'KOPRAN', name: 'Kopran Ltd' }, { symbol: 'KPRMILL', name: 'KPR Mill' },
  { symbol: 'KRBL', name: 'KRBL Ltd' }, { symbol: 'KSB', name: 'KSB Ltd' }, { symbol: 'KTKBANK', name: 'Karnataka Bank' },
  { symbol: 'LANDMARK', name: 'Landmark Cars' }, { symbol: 'LAOPALA', name: 'La Opala RG' }, { symbol: 'LATENTVIEW', name: 'Latent View' },
  { symbol: 'LAURUSLABS', name: 'Laurus Labs' }, { symbol: 'LAXMICHEM', name: 'Laxmi Organic' }, { symbol: 'LEMONTREE', name: 'Lemon Tree Hotels' },
  { symbol: 'LINDEINDIA', name: 'Linde India' }, { symbol: 'LLOYDSME', name: 'Lloyds Metals' }, { symbol: 'LUMAXIND', name: 'Lumax Industries' },
  { symbol: 'LUMAXTECH', name: 'Lumax Auto Tech' }, { symbol: 'LUXIND', name: 'Lux Industries' }, { symbol: 'MAANALU', name: 'Maan Aluminium' },
  { symbol: 'MAHABANK', name: 'Bank of Maharashtra' }, { symbol: 'MAHLIFE', name: 'Mahindra Life' }, { symbol: 'MAHLOG', name: 'Mahindra Logistics' },
  { symbol: 'MAHSEAMLES', name: 'Mahindra Seamless' }, { symbol: 'MAITHANALL', name: 'Maithan Alloys' }, { symbol: 'MARKSANS', name: 'Marksans Pharma' },
  { symbol: 'MASFIN', name: 'MAS Financial' }, { symbol: 'MASTEK', name: 'Mastek Ltd' }, { symbol: 'MATRIMONY', name: 'Matrimony.com' },
  { symbol: 'MAXHEALTH', name: 'Max Healthcare' }, { symbol: 'MIDHANI', name: 'Mishra Dhatu Nig' }
];

const nextSet = [
  { symbol: 'MINDAIND', name: 'Uno Minda' }, { symbol: 'MINDTREE', name: 'Mindtree Ltd' }, { symbol: 'MMTC', name: 'MMTC Ltd' },
  { symbol: 'MOIL', name: 'MOIL Ltd' }, { symbol: 'MONTECARLO', name: 'Monte Carlo' }, { symbol: 'MORARJEE', name: 'Morarjee Textiles' },
  { symbol: 'MOREPENLAB', name: 'Morepen Labs' }, { symbol: 'MOTHERSON', name: 'Motherson Sumi' }, { symbol: 'MOTILALOFS', name: 'Motilal Oswal' },
  { symbol: 'MPHASIS', name: 'Mphasis Ltd' }, { symbol: 'MPSLTD', name: 'MPS Ltd' }, { symbol: 'MRF', name: 'MRF Ltd' },
  { symbol: 'MRPL', name: 'MRPL' }, { symbol: 'MSTC', name: 'MSTC Ltd' }, { symbol: 'MTARTECH', name: 'MTAR Tech' },
  { symbol: 'MTNL', name: 'MTNL' }, { symbol: 'MUKANDLTD', name: 'Mukand Ltd' }, { symbol: 'MUKTAARTS', name: 'Mukta Arts' },
  { symbol: 'MUNJALAU', name: 'Munjal Auto' }, { symbol: 'MUNJALSHOW', name: 'Munjal Showa' }, { symbol: 'MURUDCERA', name: 'Murudeshwar Ceramics' },
  { symbol: 'MUTHOOTCAP', name: 'Muthoot Cap' }, { symbol: 'MUTHOOTFIN', name: 'Muthoot Finance' }, { symbol: 'NALCO', name: 'National Alum' },
  { symbol: 'NATCOPHARM', name: 'Natco Pharma' }, { symbol: 'NATIONALUM', name: 'NALCO' }, { symbol: 'NAUKRI', name: 'Info Edge' },
  { symbol: 'NAVINFLUOR', name: 'Navin Fluorine' }, { symbol: 'NAZARA', name: 'Nazara Tech' }, { symbol: 'NBCC', name: 'NBCC India' },
  { symbol: 'NCC', name: 'NCC Ltd' }, { symbol: 'NCLIND', name: 'NCL Industries' }, { symbol: 'NELCO', name: 'Nelco Ltd' },
  { symbol: 'NELCAST', name: 'Nelcast Ltd' }, { symbol: 'NESCO', name: 'Nesco Ltd' }, { symbol: 'NESTLEIND', name: 'Nestle India' },
  { symbol: 'NETWORK18', name: 'Network18' }, { symbol: 'NEULANDLAB', name: 'Neuland Labs' }, { symbol: 'NEWGEN', name: 'Newgen Software' },
  { symbol: 'NFL', name: 'National Fert' }, { symbol: 'NH', name: 'Narayana Hrudayalaya' }, { symbol: 'NHPC', name: 'NHPC Ltd' },
  { symbol: 'NIACL', name: 'New India Assurance' }, { symbol: 'NIITLTD', name: 'NIIT Ltd' }, { symbol: 'NILKAMAL', name: 'Nilkamal Ltd' },
  { symbol: 'NMDC', name: 'NMDC Ltd' }, { symbol: 'NLCINDIA', name: 'NLC India' }, { symbol: 'NTPC', name: 'NTPC Ltd' },
  { symbol: 'NUCLEUS', name: 'Nucleus Software' }, { symbol: 'NYKAA', name: 'Nykaa' }, { symbol: 'OBEROIRLTY', name: 'Oberoi Realty' },
  { symbol: 'OFSS', name: 'Oracle Fin' }, { symbol: 'OIL', name: 'Oil India' }, { symbol: 'OLECTRA', name: 'Olectra Greentech' },
  { symbol: 'OMAXE', name: 'Omaxe Ltd' }, { symbol: 'ONGC', name: 'ONGC' }, { symbol: 'ONMOBILE', name: 'OnMobile Global' },
  { symbol: 'OPTIEMUS', name: 'Optiemus Infracom' }, { symbol: 'ORCHPHARMA', name: 'Orchid Pharma' }, { symbol: 'ORIENTBELL', name: 'Orient Bell' },
  { symbol: 'ORIENTELEC', name: 'Orient Electric' }, { symbol: 'ORIENTHOT', name: 'Oriental Hotels' }, { symbol: 'ORIENTPPR', name: 'Orient Paper' },
  { symbol: 'ORISSAMINE', name: 'Orissa Minerals' }, { symbol: 'PAGEIND', name: 'Page Industries' }, { symbol: 'PANAMAPET', name: 'Panama Petro' },
  { symbol: 'PARADEEP', name: 'Paradeep Phosphates' }, { symbol: 'PARAGMILK', name: 'Parag Milk Foods' }, { symbol: 'PARAS', name: 'Paras Defence' },
  { symbol: 'PARSVNATH', name: 'Parsvnath Dev' }, { symbol: 'PATANJALI', name: 'Patanjali Foods' }, { symbol: 'PATELENG', name: 'Patel Eng' },
  { symbol: 'PAYTM', name: 'Paytm' }, { symbol: 'PCBL', name: 'PCBL Ltd' }, { symbol: 'PDSM', name: 'PDS Ltd' },
  { symbol: 'PERSISTENT', name: 'Persistent Systems' }, { symbol: 'PETRONET', name: 'Petronet LNG' }, { symbol: 'PFC', name: 'PFC' },
  { symbol: 'PFIZER', name: 'Pfizer Ltd' }, { symbol: 'PHOENIXLTD', name: 'Phoenix Mills' }, { symbol: 'PIDILITIND', name: 'Pidilite Ind' },
  { symbol: 'PIIND', name: 'PI Industries' }, { symbol: 'PNB', name: 'PNB' }, { symbol: 'PNBHOUSING', name: 'PNB Housing' },
  { symbol: 'PNCINFRA', name: 'PNC Infratech' }, { symbol: 'POLYCAB', name: 'Polycab India' }, { symbol: 'POLYMED', name: 'Poly Medicure' },
  { symbol: 'POLYPLEX', name: 'Polyplex Corp' }, { symbol: 'POONAWALLA', name: 'Poonawalla Fin' }, { symbol: 'POWERGRID', name: 'Power Grid' },
  { symbol: 'POWERMECH', name: 'Power Mech Projects' }, { symbol: 'PRAJIND', name: 'Praj Industries' }, { symbol: 'PRESTIGE', name: 'Prestige Estates' },
  { symbol: 'PRICOLLTD', name: 'Pricol Ltd' }, { symbol: 'PRINCEPIPE', name: 'Prince Pipes' }, { symbol: 'PRSMJOHNSN', name: 'Prism Johnson' },
  { symbol: 'PRUDENT', name: 'Prudent Corp' }, { symbol: 'PSB', name: 'Punjab & Sind Bank' }, { symbol: 'PSPPROJECT', name: 'PSP Projects' },
  { symbol: 'PTC', name: 'PTC India' }, { symbol: 'PURVA', name: 'Puravankara Ltd' }, { symbol: 'PVRINOX', name: 'PVR INOX' },
  { symbol: 'QUESS', name: 'Quess Corp' }, { symbol: 'QUICKHEAL', name: 'Quick Heal' }, { symbol: 'RADICO', name: 'Radico Khaitan' },
  { symbol: 'RAILTEL', name: 'RailTel Corp' }, { symbol: 'RAIN', name: 'Rain Industries' }, { symbol: 'RAINBOW', name: 'Rainbow Medicare' },
  { symbol: 'RAJRATAN', name: 'Rajratan Global' }, { symbol: 'RALLIS', name: 'Rallis India' }, { symbol: 'RAMCOCEM', name: 'Ramco Cements' },
  { symbol: 'RAMCOSYS', name: 'Ramco Systems' }, { symbol: 'RATNAMANI', name: 'Ratnamani Metals' }, { symbol: 'RAYMOND', name: 'Raymond Ltd' },
  { symbol: 'RBA', name: 'Restaurant Brands' }, { symbol: 'RBLBANK', name: 'RBL Bank' }, { symbol: 'RCF', name: 'RCF Ltd' },
  { symbol: 'RECLTD', name: 'REC Ltd' }, { symbol: 'REDINGTON', name: 'Redington Ltd' }, { symbol: 'RELAXO', name: 'Relaxo Footwears' },
  { symbol: 'RELIANCE', name: 'Reliance Ind' }, { symbol: 'REPCOHOME', name: 'Repco Home Fin' }, { symbol: 'RHIM', name: 'RHI Magnesita' },
  { symbol: 'RITES', name: 'RITES Ltd' }, { symbol: 'RKFORGE', name: 'Ramkrishna Forgings' }
];

const completeSet = [...s1Set, ...nextSet];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');
    
    await Stock.deleteMany({});
    console.log(`Seeding ${completeSet.length} total stocks...`);
    
    const prepared = completeSet.map(s => ({
      ...s,
      price: Math.floor(Math.random() * 5000) + 50,
      change: (Math.random() * 10 - 5).toFixed(2),
      volume: (Math.random() * 50).toFixed(1) + 'M',
      ltp: 0
    }));
    
    await Stock.insertMany(prepared);
    console.log('Seeding complete!');
    console.log(`Final Total stocks: ${await Stock.countDocuments()}`);
    process.exit(0);
  } catch (err) { console.error(err); process.exit(1); }
}
seed();
