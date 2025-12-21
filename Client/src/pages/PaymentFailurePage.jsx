import { useSearchParams, Link } from "react-router-dom";

const PaymentFailurePage = () => {
    const [searchParams] = useSearchParams();
    const errorMessage = searchParams.get("error") || "Ödeme işlemi sırasında bir hata oluştu.";

    return (
        <div className="container mx-auto py-20 text-center">
            <h1 className="text-4xl font-bold text-red-600 mb-4">Ödeme Başarısız!</h1>
            <p className="text-lg text-red-500 mb-8">
                {errorMessage}
            </p>
            <div className="flex justify-center gap-4">
                <Link to="/payment" className="btn bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600">
                    Tekrar Dene
                </Link>
                <Link to="/" className="btn bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
                    Anasayfaya Dön
                </Link>
            </div>
        </div>
    );
};

export default PaymentFailurePage;
