import { motion } from "framer-motion";
import './Product.css';
import Header from "../components/common/Header";


import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesTrendChart from "../components/products/SalesTrendChart";
import ProductsTable from "../components/products/ProductsTable";
import Transcation from "./Transcation.jsx";
import { useState } from "react";
import OrdersTable from "../components/orders/OrdersTable.jsx";

const ProductsPage = () => {
	const [address,setAddress]=useState()
	const [address1,setAddress1]=useState()
	console.log("aa",address)
	function p(){
		setAddress1(address)
		
		
	}
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Transaction-Status' />

			<div className="search-container">
				<input 
					type="text" 
					placeholder="Enter User Address" 
					className="p1"
					value={address}
					onChange={((e)=>setAddress(e.target.value))}
				/>
			
				<img 
					width="20" 
					height="20" 
					src="https://img.icons8.com/ios-glyphs/50/search.png" 
					alt="search" 
					className="search-icon"
					onClick={p}
					
				/>
			
			</div>
			{address1 ? <Transcation  address1={address1}/> : <></>}
			
		</div>
	);
};

export default ProductsPage;
