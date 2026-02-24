import AdjustmentPageTemplate from '../../../components/AdjustmentPageTemplate'

const AdjFoodBeverage = () => {
  return (
    <AdjustmentPageTemplate
      category="food_beverage"
      title="Adjustment - Food & Beverage"
      subtitle="F&B adjustment and corrections"
      icon="🍽️"
      adjTypes={[
        'Price Correction',
        'Void Transaction',
        'Order Modification',
        'Bill Adjustment',
        'Discount',
        'Refund'
      ]}
    />
  )
}

export default AdjFoodBeverage
