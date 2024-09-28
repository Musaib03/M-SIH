import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import './Order.css';
import {  DollarSign} from "lucide-react";
import StatCard from "../common/StatCard";

const OrdersTable = ({ transactions, address1,balance }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredOrders, setFilteredOrders] = useState(transactions || []);

	useEffect(() => {
		setFilteredOrders(
			transactions.filter(
				(order) =>
					order.hash.toLowerCase().includes(searchTerm) ||
					order.from.toLowerCase().includes(searchTerm)
			)
		);
	}, [searchTerm, transactions]);

	const handleSearch = (e) => {
		setSearchTerm(e.target.value.toLowerCase());
	};

	return (
	<div>
		<div  className="o1">
		<StatCard name='ETH Balance' icon={DollarSign} value={balance} color='#EF4444' />
		</div>
		
			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Hash Id
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								From
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								To
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Status
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Value
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Time
							</th>
						</tr>
					</thead>

					<tbody className='divide divide-gray-700'>
						{filteredOrders.map((order) => {
							const isSender = order.from.toLowerCase() === address1.toLowerCase();
							const isReceiver = order.to.toLowerCase() === address1.toLowerCase();
							return (
								<motion.tr
									key={order.id}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.3 }}
								>
									<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
										{order.hash}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
										{order.from}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
										{order.to}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
										{isSender ? <p className="send">  Send</p> : isReceiver ? <p className="rec">Received</p> : "N/A"}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
									{(order.value / 1e18).toFixed(5)} ETH
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
									{new Date(order.timeStamp * 1000).toLocaleString()}
									</td>
								</motion.tr>
							);
						})}
					</tbody>
				</table>
			</div>
	</div>
		
	);
};

export default OrdersTable;
