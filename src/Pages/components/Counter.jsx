import React from "react";
import { configStore } from "../../Stores/config.store";
import { Button, Space, InputNumber } from "antd";
import { useState } from "react";

const Counter = () => {
  const { count, increase, setCount, decrease, resetCount } = configStore();
  const [amount, setAmount] = useState(null);
  const config = configStore();

  const handleIncrease = () => {
    if (amount) {
      increase(amount);
      setAmount(null);
    }
  };
  return (
    <div>
      <h1>Count: {count}</h1>
      <div>
        {config?.categories?.map((item) => (
          <div key={item.category_id}>
            <h1>{item.name}</h1>
          </div>
        ))}
      </div>
      <Space>
        <InputNumber
          min={0}
          value={amount}
          onChange={(value) => setAmount(value)}
        />

        <Button onClick={handleIncrease}>Add</Button>

        <Button onClick={() => increase(amount)}>Increase</Button>
        <Button onClick={() => decrease(amount)}>Decrease</Button>

        <Button onClick={resetCount}>Reset</Button>
      </Space>
    </div>
  );
};

export default Counter;
