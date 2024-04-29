import type { ReactElement } from 'react'
import Layout from '../app/layout'
import type { NextPageWithLayout } from './_app'
import { redirect } from 'next/navigation'
import TablePage from './home'
 
export default function Index() {
  return (
    <TablePage />
  )
}
