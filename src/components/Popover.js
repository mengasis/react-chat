import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'react-emotion'
import { Manager, Reference, Popper } from 'react-popper'

const PositionWrapper = styled('div')`
	display: ${props => (props.isOpen ? 'block' : 'none')};
	z-index: 1000;
`

export class Popover extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isOpen: false,
			alreadyUsed: false
		}

		this.debouncedScroll = _.debounce(this.handleScroll, 20, {
			leading: true,
			trailing: false
		})
	}

	componentDidUpdate(prevProps) {
		if (!prevProps.isVisible && this.props.isVisible === true) this.open()
		if (prevProps.isVisible && this.props.isVisible === false) this.close()
	}

	componentDidMount() {
		if (this.props.trigger === 'click') {
			document.addEventListener('click', this.handleClickToClose, true)
		}
	}

	componentWillUnmount() {
		if (this.props.trigger === 'click') {
			document.removeEventListener('click', this.handleClickToClose, true)
		}
		if (this.props.closeOnScroll) {
			window.removeEventListener('mousewheel', this.debouncedScroll)
		}
	}

	open() {
		if (this.props.closeOnScroll) {
			window.addEventListener('mousewheel', this.debouncedScroll)
		}
		this.setState({ isOpen: true, alreadyUsed: true }, () => {
			if (this.props.onOpen) this.props.onOpen()
		})
	}

	close() {
		if (this.props.closeOnScroll) {
			window.removeEventListener('mousewheel', this.debouncedScroll)
		}
		this.setState({ isOpen: false }, () => {
			if (this.props.onClose) this.props.onClose()
		})
	}

	handleScroll = event => {
		if (this.state.isOpen && !this.containerRef.contains(event.target)) {
			this.close()
		}
	}

	handleClickToOpen = () => {
		this.open()
	}

	handleClickToClose = event => {
		if (
			this.state.isOpen &&
			(!this.containerRef.contains(event.target) &&
				!this.handlerRef.contains(event.target))
		) {
			this.close()
		}
	}

	handleMouseEnter = () => {
		if (this.delayTimer) clearTimeout(this.delayTimer)
		this.delayTimer = setTimeout(() => this.open(), this.props.mouseEnterDelay)
	}

	handleMouseLeave = () => {
		if (this.delayTimer) clearTimeout(this.delayTimer)
		this.delayTimer = setTimeout(() => this.close(), this.props.mouseLeaveDelay)
	}

	createTriggerNode() {
		const props = {}

		if (this.props.trigger === 'click') {
			props.onClick = this.handleClickToOpen
		}
		if (this.props.trigger === 'hover') {
			props.onMouseEnter = this.handleMouseEnter
			props.onMouseLeave = this.handleMouseLeave
		}

		return React.cloneElement(this.props.handler, props)
	}

	render() {
		const mouseProps =
			this.props.trigger === 'hover'
				? {
					onMouseEnter: this.handleMouseEnter,
					onMouseLeave: this.handleMouseLeave
				  }
				: {}

		const validProps = _.omit(
			{
				...this.props,
				...mouseProps,
				isOpen: this.state.isOpen
			},
			['onOpen', 'onClose']
		)

		const modifiers = {
			...this.props.modifiers,
			hide: {
				enabled: false
			},
			computeStyle: {
				gpuAcceleration: false
			}
		}

		// if it should not be destroyed by hiding, or if it should be destroyed but it is open
		const displayPopover = this.props.destroyOnHide === false || this.state.isOpen

		return (
			<Manager>
				{this.props.handler && (
					<Reference innerRef={node => (this.handlerRef = node)}>
						{({ ref }) => {
							return <span ref={ref}>{this.createTriggerNode()}</span>
						}}
					</Reference>
				)}
				{displayPopover &&
					this.state.alreadyUsed && (
					<Popper
						innerRef={node => (this.containerRef = node)}
						modifiers={{ ...modifiers }}
						placement={this.props.placement}
						positionFixed={true}
						{...(this.props.referenceElement
							? { referenceElement: this.props.referenceElement }
							: {})}
					>
						{renderArgs => {
							const {
								ref,
								style,
								placement,
								scheduleUpdate
							} = renderArgs

							if (this.props.getUpdateMethod) {
								this.props.getUpdateMethod(scheduleUpdate)
							}

							const styles = { ...style }

							if (typeof this.props.children === 'function') {
								return (
									<PositionWrapper
										innerRef={ref}
										style={styles}
										data-placement={placement}
										{...validProps}
									>
										{this.props.children(renderArgs)}
									</PositionWrapper>
								)
							} else {
								return (
									<PositionWrapper
										innerRef={ref}
										style={styles}
										data-placement={placement}
										{...validProps}
									>
										{this.props.children}
									</PositionWrapper>
								)
							}
						}}
					</Popper>
				)}
			</Manager>
		)
	}
}

Popover.propTypes = {
	trigger: PropTypes.string,
	handler: PropTypes.node,
	referenceElement: PropTypes.object,
	placement: PropTypes.string,
	children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
	onClose: PropTypes.func,
	onOpen: PropTypes.func,
	mouseEnterDelay: PropTypes.number,
	mouseLeaveDelay: PropTypes.number,
	destroyOnHide: PropTypes.bool,
	closeOnScroll: PropTypes.bool,
	modifiers: PropTypes.object,
	isVisible: PropTypes.bool,
	getUpdateMethod: PropTypes.func
}

Popover.defaultProps = {
	mouseEnterDelay: 200,
	mouseLeaveDelay: 200,
	placement: 'auto',
	destroyOnHide: true
}
