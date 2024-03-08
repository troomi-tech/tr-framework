import React from 'react';
import './IcomoonDemo.scss';
import '../icons/demo-files/demo.css';
import { useEffect, useState } from 'react';

const DemoComponent: React.FC = () => {
	const [htmlContent, setHtmlContent] = useState<string>('');

	useEffect(() => {
		fetch('icomoon/icons/demo.html')
			.then((response) => response.text())
			.then((data) => setHtmlContent(data))
			.catch((error) => console.error('Error loading HTML file:', error));
	}, []);

	return <div id="IcomoonDemo" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

export default DemoComponent;
