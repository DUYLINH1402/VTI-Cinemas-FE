import axios from "axios";
import { useEffect, useState } from "react";

export const Service = ({ setComboPrice }) => {
  const [service, setService] = useState([]);

  useEffect(() => {
    const fetchDataService = async () => {
      try {
        const reponse = await axios.get(
          "https://vticinema-default-rtdb.firebaseio.com/MoreService.json"
        );
        const data = reponse.data;
        setService(data);
      } catch (error) {
        console.error("Error fetching service data:", error);
      }
    };
    fetchDataService();
  }, []);

  return (
    <>
      {service ? (
        <Detai_Service service={service} setComboPrice={setComboPrice} />
      ) : (
        "Loading..."
      )}
    </>
  );
};

export const Detai_Service = ({ service, setComboPrice }) => {
  const serviceEntries = Object.entries(service);
  const [quantities, setQuantities] = useState({});

  const handleQuantityChange = (key, price, quantity) => {
    if (quantity < 0) {
      return;
    }
    // Cập nhật trạng thái số lượng cho dịch vụ cụ thể
    const newQuantities = {
      ...quantities,
      [key]: quantity,
    };
    setQuantities(newQuantities);

    // Tính tổng giá dựa trên số lượng cập nhật
    const totalPrice = serviceEntries.reduce(
      (sum, [k, item]) => sum + (newQuantities[k] || 0) * item.price,
      0
    );
    setComboPrice(totalPrice);
  };
  return (
    <>
      {serviceEntries.map(([key, serviceItem]) => (
        <div
          key={key}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr 1fr",
          }}
        >
          <div>
            <h2>{serviceItem.name_service}</h2>
          </div>
          <div>
            <h3>{serviceItem.describe}</h3>
          </div>
          <div>
            <input
              type="number"
              min={0}
              value={quantities[key] || 0}
              onChange={(e) =>
                handleQuantityChange(
                  key,
                  service.price,
                  parseInt(e.target.value) || 0
                )
              }
            />
          </div>
        </div>
      ))}
    </>
  );
};
