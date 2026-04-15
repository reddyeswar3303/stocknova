import LiveStockTable from "../components/LiveStockTable";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MarketPage() {
  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Market <span className="text-[#00D09C]">Watch</span>
            </h1>
            <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
              Stay ahead with real-time insights from global markets. 
              Powered by Alpha Vantage for reliable and accurate financial data.
            </p>
          </div>
          
          <LiveStockTable />
        </div>
      </div>
      <Footer />
    </div>
  );
}
