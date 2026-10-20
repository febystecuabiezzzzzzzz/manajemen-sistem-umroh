'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { DataService, Cabang } from '@/lib/data-service'

interface BranchContextType {
  selectedBranch: string
  setSelectedBranch: (branch: string) => void
  branches: Cabang[]
  loadBranches: () => Promise<void>
}

const BranchContext = createContext<BranchContextType | undefined>(undefined)

export function BranchProvider({ children }: { children: ReactNode }) {
  const [selectedBranch, setSelectedBranchState] = useState<string>('Semua Cabang')
  const [branches, setBranches] = useState<Cabang[]>([])

  const loadBranches = async () => {
    try {
      const list = await DataService.getCabangList()
      setBranches(list)
    } catch {}
  }

  useEffect(() => {
    loadBranches()
    const saved = localStorage.getItem('umroh_selected_cabang')
    if (saved) {
      setSelectedBranchState(saved)
    }
  }, [])

  const setSelectedBranch = (branch: string) => {
    setSelectedBranchState(branch)
    try {
      localStorage.setItem('umroh_selected_cabang', branch)
    } catch {}
  }

  return (
    <BranchContext.Provider
      value={{
        selectedBranch,
        setSelectedBranch,
        branches,
        loadBranches,
      }}
    >
      {children}
    </BranchContext.Provider>
  )
}

export function useBranch() {
  const context = useContext(BranchContext)
  if (!context) {
    return {
      selectedBranch: 'Semua Cabang',
      setSelectedBranch: () => {},
      branches: [],
      loadBranches: async () => {},
    }
  }
  return context
}
