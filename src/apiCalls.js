export const getOrders = () => {
  return fetch('http://localhost:3001/api/v1/orders')
      .then(response => response.json())
}

export const submitOrder = (newOrder) => {
  return fetch('http://localhost:3001/api/v1/orders',
    { method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newOrder)
    }
  )
  .then(response => {
     return response.json()
  })
}
