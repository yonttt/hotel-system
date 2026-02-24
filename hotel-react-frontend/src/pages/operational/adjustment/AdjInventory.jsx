import AdjustmentPageTemplate from '../../../components/AdjustmentPageTemplate'

const AdjInventory = () => {
  return (
    <AdjustmentPageTemplate
      category="inventory"
      title="Adjustment - Inventory"
      subtitle="Inventory adjustment and corrections"
      icon="📦"
      adjTypes={[
        'Stock Addition',
        'Stock Reduction',
        'Write-off',
        'Stock Opname',
        'Transfer',
        'Correction'
      ]}
    />
  )
}

export default AdjInventory
