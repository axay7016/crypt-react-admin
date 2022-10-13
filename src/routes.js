import { lazy } from 'react'
import Login from './views/pages/login/Login'
import Page404 from './views/pages/page404/Page404'
import Page500 from './views/pages/page500/Page500'


//import games sub menu

import CoinsList from './views/games/CoinsList'
import EditCoin from './views/games/EditCoin'
import GamesListing from './views/games/GamesListing'
import DeclareGame from './views/games/DeclareGame'
import CreateNewGame from './views/games/CreateNewGame'
import CurrentPricesListing from './views/games/CurrentPricesListing'
import CoinLogs from './views/games/CoinLogs'
import ScheduleGame from './views/games/ScheduleGame'
import Range from './views/games/Range'

//import team sub menu
import TeamMembers from './views/team/TeamMembersList'
import AddTeamMember from './views/team/AddTeamMember'
import UpdateTeamMember from './views/team/UpdateTeamMember'

// import Coupons sub menu
import Coupons from './views/coupon/CouponListing'
import AddCoupon from './views/coupon/AddCoupon'
import UpdateCoupon from './views/coupon/UpdateCoupon'

// import Partners sub menu
import PartnersListing from './views/partners/PartnersListing'
import AddPartner from './views/partners/AddPartner'
import UpdatePartner from './views/partners/UpdatePartner'

const Dashboard = lazy(() => import('./views/dashboard/Dashboard'))
const Notification = lazy(() => import('./views/notification/Notification'))
const ChangePassword = lazy(() => import('./views/changePassword/ChangePassword'))

const AccountStatement = lazy(() => import('./views/accountStatement/AccountStatement'))
const Bids = lazy(() => import('./views/bids/Bids'))
const FailedBids = lazy(() => import('./views/failedBids/FailedBids'))
const Users = lazy(() => import('./views/users/Users'))

const WithdrawListing = lazy(() => import('./views/withdraw/WithdrawListing'))

const SubcribersListing = lazy(() => import('./views/subcribers/Subcribers'))

const Settings = lazy(() => import('./views/settings/Settings'))
const PendingBonus = lazy(() => import('./views/pendingBonus/PendingBonus'))

const Nothing = lazy(() => import('./views/pages/nothing/Nothing'))





const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/login', name: 'login', element: Login },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/notification', name: 'Notification', element: Notification },
  { path: '/changePassword', name: 'ChangePassword', element: ChangePassword },

  { path: '/games/coin-listing', name: 'Coin Listing', element: CoinsList },
  { path: '/games/games-listing', name: 'Game Listing', element: GamesListing },
  { path: '/games/declare-game', name: 'View Game', element: DeclareGame },
  { path: '/games/create-new-game', name: 'Create New Game', element: CreateNewGame },
  { path: '/games/current-prices', name: 'Current Prices', element: CurrentPricesListing },
  { path: '/games/coin-logs', name: 'Coin Logs', element: CoinLogs },
  { path: '/games/schedule-game', name: 'Schedule Game', element: ScheduleGame },
  { path: '/games/hilo', name: 'Hilo', element: Range },

  { path: '/edit-coin', name: 'Edit Coin', element: EditCoin },

  { path: '/account-statement', name: 'Account Statement', element: AccountStatement, exact: true },
  { path: '/bids', name: 'Bids', element: Bids, exact: true },
  { path: '/failed-bids', name: 'Failed Bids', element: FailedBids, exact: true },
  { path: '/users', name: 'Users', element: Users, exact: true },

  { path: '/teams/team-members', name: 'Team Members', element: TeamMembers, },
  { path: '/teams/add-team-member', name: 'Add Team Member', element: AddTeamMember, },
  { path: '/teams/update-team-member', name: 'Update Team Member', element: UpdateTeamMember, },

  { path: '/coupons/coupons', name: 'Coupons', element: Coupons, exact: true },
  { path: '/coupons/add-new-coupon', name: 'Add New Coupon', element: AddCoupon, exact: true },
  { path: '/coupons/update-coupon', name: 'Edit Coupon', element: UpdateCoupon, exact: true },


  { path: '/withdraw', name: 'Withdraw', element: WithdrawListing, exact: true },
  { path: '/subscribers', name: 'Subscribers', element: SubcribersListing, exact: true },


  { path: '/partners/partners-listing', name: 'Partners', element: PartnersListing, exact: true },
  { path: '/partners/add-new-partner', name: 'Add New Partner', element: AddPartner, exact: true },
  { path: '/partners/update-partner', name: 'Update Partner', element: UpdatePartner, exact: true },


  { path: '/settings', name: 'Settings', element: Settings, exact: true },

  { path: '/pending-bonus', name: 'Pending Bonus', element: PendingBonus, exact: true },

  { path: '/nothing', element: Nothing, exact: true },

  { path: '/page500', element: Page500, exact: true },

  { path: '*', name: 'Notfound', element: Page404, },

]

export default routes
