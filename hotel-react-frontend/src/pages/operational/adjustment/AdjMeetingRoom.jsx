import AdjustmentPageTemplate from '../../../components/AdjustmentPageTemplate'

const AdjMeetingRoom = () => {
  return (
    <AdjustmentPageTemplate
      category="meeting_room"
      title="Adjustment - Meeting Room"
      subtitle="Meeting room adjustment and corrections"
      icon="🏢"
      adjTypes={[
        'Booking Adjustment',
        'Price Correction',
        'Schedule Modification',
        'Cancellation',
        'Refund',
        'Bill Adjustment'
      ]}
    />
  )
}

export default AdjMeetingRoom
