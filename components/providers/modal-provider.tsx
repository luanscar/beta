'use client'

import { useEffect, useState } from 'react'
import { CreateProfileModal } from '../modals/CreateProfileModal'
import { EditProfileModal } from '../modals/EditProfileModal'
import { CreateChannelModal } from '../modals/CreateChannelModal'

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <CreateProfileModal />
      <EditProfileModal />
      <CreateChannelModal />
    </>
  )
}
