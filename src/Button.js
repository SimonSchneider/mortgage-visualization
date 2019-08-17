import React from 'react'
import Button from 'react-bootstrap/Button'

function SButton({ onClick, text }) {
  return <Button
    size="sm"
    variant="outline-primary"
    onClick={onClick}
  >{text}</Button>
}

export default SButton