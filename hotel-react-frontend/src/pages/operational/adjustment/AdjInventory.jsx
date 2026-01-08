import ComingSoonPage from '../../../components/ComingSoonPage'

const AdjInventory = () => {
  return (
    <ComingSoonPage
      title="Adjustment - Inventory"
      subtitle="Inventory adjustment and corrections"
      icon="📦"
      features={[
        'Stock adjustments',
        'Inventory corrections',
        'Stock opname',
        'Write-off management',
        'Transfer between locations'
      ]}
    />
  )
}

export default AdjInventory
