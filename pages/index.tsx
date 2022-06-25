import styled from 'styled-components'
import MESSAGES from '../messages/messages'

const Header = styled.h1.attrs({
	className: 'text-5xl font-bold',
})``

const Home:React.FC = () => (
	<div className='hero min-h-screen bg-base-200'>
		<div className='hero-content text-center'>
			<div className='max-w-md'>
				<Header>{MESSAGES.global.appName}</Header>
				<button className='btn btn-primary mt-6'>{MESSAGES.index.action}</button>
			</div>
		</div>
	</div>
)

export default Home