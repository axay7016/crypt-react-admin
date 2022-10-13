import React from "react";
import CIcon from "@coreui/icons-react";
import {
  cilBank,
  cilGamepad,
  cilMoney,
  cilPeople,
  cilSettings,
  cilSpeedometer,
  cilUser,
  cilWallet,
} from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'

const user_type = JSON.parse(localStorage.getItem("user_type"));
let _nav = [];
let gameNav = [];
if (user_type && user_type == "team_member") {
  const role = localStorage.getItem("role").replaceAll('"', "").split(",");

  if (role.includes("user")) {
    _nav.push({
      component: CNavItem,
      name: "Users",
      to: "/users",
      icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    });
  }

  if (role.includes("account_statement")) {
    _nav.push({
      component: CNavItem,
      name: "Account Statement",
      to: "/account-statement",
      icon: <CIcon icon={cilBank} customClassName="nav-icon" />,
    });
  }

  if (role.includes("bids")) {
    _nav.push({
      component: CNavItem,
      name: "Bids",
      to: "/bids",
      icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
    });
  }

  if (role.includes("coin_listing")) {
    gameNav.push({
      component: CNavItem,
      name: "Coin Listing",
      to: "/games/coin-listing",
    });
  }

  if (role.includes("game_listing")) {
    gameNav.push({
      component: CNavItem,
      name: "Game Listing",
      to: "/games/games-listing",
    });
  }



  if (role.includes("create_new_game")) {
    gameNav.push({
      component: CNavItem,
      name: "Create New Game",
      to: "/games/create-new-game",
    });
  }

  if (role.includes("current_prices")) {
    gameNav.push({
      component: CNavItem,
      name: "Current Prices",
      to: "/games/current-prices",
    });
  }

  if (role.includes("scheduled_game")) {
    gameNav.push({
      component: CNavItem,
      name: "Schedule Game",
      to: "/games/schedule-game",
    });
  }

  if (
    role.includes("coin_listing") ||
    role.includes("game_listing") ||
    role.includes("create_new_game") ||
    role.includes("current_prices") ||
    role.includes("scheduled_game")
  ) {
    _nav.push({
      component: CNavGroup,
      name: "Games",
      to: "/games",
      icon: <CIcon icon={cilGamepad} customClassName="nav-icon" />,
      items: gameNav,
    });
  }
} else {
  _nav = [
    {
      component: CNavItem,
      name: "Dashboard",
      to: "/dashboard",
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    },
    {
      component: CNavGroup,
      name: "Games",
      to: "/games",
      icon: <CIcon icon={cilGamepad} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: "Coin Listing",
          to: "/games/coin-listing",
        },

        {
          component: CNavItem,
          name: "Game Listing",
          to: "/games/games-listing",
        },
        {
          component: CNavItem,
          name: "Create New Game",
          to: "/games/create-new-game",
        },
        {
          component: CNavItem,
          name: "Current Prices",
          to: "/games/current-prices",
        },
        {
          component: CNavItem,
          name: "Schedule Game",
          to: "/games/schedule-game",
        },
        {
          component: CNavItem,
          name: "Hilo",
          to: "/games/hilo",
        },
      ],
    },
    {
      component: CNavItem,
      name: "Account Statement",
      to: "/account-statement",
      icon: <CIcon icon={cilBank} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: "Bids",
      to: "/bids",
      icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: "Failed Bids",
      to: "/failed-bids",
      icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: "Users",
      to: "/users",
      icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    },
    {
      component: CNavGroup,
      name: "Team",
      to: "/teams",
      icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: "Team Members",
          to: "/teams/team-members",
        },
        {
          component: CNavItem,
          name: "Add Team Member",
          to: "/teams/add-team-member",
        },
      ],
    },
    {
      component: CNavGroup,
      name: "Coupons",
      to: "/coupons",
      icon: <CIcon icon={cilWallet} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: "Coupons",
          to: "/coupons/coupons",
        },
        {
          component: CNavItem,
          name: "Add New Coupon",
          to: "/coupons/add-new-coupon",
        },
      ],
    },
    {
      component: CNavItem,
      name: "Withdraw",
      to: "/withdraw",
      icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: "Subscribers",
      to: "/subscribers",
      icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    },
    {
      component: CNavGroup,
      name: "Partners",
      to: "/partners",
      icon: <CIcon icon={cilWallet} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: "Partners",
          to: "/partners/partners-listing",
        },
        {
          component: CNavItem,
          name: "Add New Partner",
          to: "/partners/add-new-partner",
        },
      ],
    },
    {
      component: CNavItem,
      name: "Pending Bonus",
      to: "/pending-bonus",
      icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    },
    // {
    //   component: CNavItem,
    //   name: "Settings",
    //   to: "/settings",
    //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    // },

  ];
}

export default _nav;
