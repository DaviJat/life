'use client';

import { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface MoneyLocation {
  description: string;
  type: string;
}

function MoneyLocationTable() {
  const [moneyLocations, setMoneyLocations] = useState<MoneyLocation[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/finance/money-location');
        if (response.ok) {
          const data = await response.json();
          setMoneyLocations(data.moneyLocations);
        } else {
          console.error('Failed to fetch money locations:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching money locations:', error);
      }
    }
    fetchData();
  }, []);

  return (
    <Table>
      <TableCaption>A list of your money locations.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Description</TableHead>
          <TableHead>Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {moneyLocations.map((location, index) => (
          <TableRow key={index}>
            <TableCell>{location.description}</TableCell>
            <TableCell>{location.type}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default MoneyLocationTable;
