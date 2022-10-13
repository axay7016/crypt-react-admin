import {
  CAlert,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableRow,
} from "@coreui/react";
import React, { useEffect } from "react";
import Loader from "src/components/Loader";
import ColumnHeader from "src/components/table/ColumnHeader";
import { useGetDashaboardDataQuery } from "src/servicesRtkQuery/adminApi";
import { gameOddWebSocket } from "src/utils/webSocket";
import { useSelector } from "react-redux";
const Dashboard = () => {
  const headerCellsTable1 = [
    "Game",
    "Game Id",
    "Duration",
    "Current Price",
    "High Odd",
    "Mid Odd",
    "Low Odd",
  ];

  const headerCellsTable2 = [
    "Game",
    "Game No",
    "Duration",
    "Bids",
    "Players",
    "User High",
    "User Mid",
    "User Low",
    "Player High",
    "Player Mid",
    "Player Low",
  ];
  const headerCellsTable3 = [" ", "Today", "Till Yesterday"];
  const { data, isLoading, isSuccess, isError, error } = useGetDashaboardDataQuery();
  let liveGamesBids = [];
  let liveGamesOdd = [];
  let balances = {};

  if (isSuccess) {

    liveGamesBids = data.results?.livegamesbids;
    liveGamesOdd = data.results?.livegamesodd;
    balances = data.results?.balances;

  }
  useEffect(() => {
    gameOddWebSocket();
  }, []);
  const webSocketData = useSelector(
    (state) => state.webSocketGameReducer.gameOddSocket
  );

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <CAlert color="danger">{error}</CAlert>
      ) : (
        isSuccess && (
          <>
            {
              liveGamesOdd &&
              <CTable>
                <CTableHead>
                  <CTableRow>
                    <ColumnHeader headerCells={headerCellsTable1} />
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {liveGamesOdd.map((data, index) => {
                    let price_data = webSocketData?.data?.filter(
                      (item) => item.game_id === data.id
                    );
                    price_data = price_data && price_data[0] ? price_data[0] : [];
                    return (
                      <CTableRow key={index}>
                        <CTableDataCell>{data.Game}</CTableDataCell>
                        <CTableDataCell>{data.game_id}</CTableDataCell>
                        <CTableDataCell>{data.duration}</CTableDataCell>
                        <CTableDataCell>{price_data && price_data.current_price ? price_data.current_price : data.current_price}</CTableDataCell>
                        <CTableDataCell>{price_data && price_data.high_odd ? price_data.high_odd : data.high_odd}</CTableDataCell>
                        <CTableDataCell>{price_data && price_data.mid_odd ? price_data.mid_odd : data.mid_odd}</CTableDataCell>
                        <CTableDataCell>{price_data && price_data.low_odd ? price_data.low_odd : data.low_odd}</CTableDataCell>
                      </CTableRow>
                    );
                  })}
                </CTableBody>
              </CTable>
            }
            <div className=" bg-secondary" style={{ height: `50px` }}></div>
            {
              liveGamesBids &&
              <CTable>
                <CTableHead>
                  <CTableRow>
                    <ColumnHeader headerCells={headerCellsTable2} />
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {liveGamesBids?.map((data, index) => {
                    return (
                      <CTableRow key={index}>
                        <CTableDataCell>{data.Game}</CTableDataCell>
                        <CTableDataCell>{data.Gameno}</CTableDataCell>
                        <CTableDataCell>{data.Duration}</CTableDataCell>
                        <CTableDataCell>{data.Bids}</CTableDataCell>
                        <CTableDataCell>{data.Players}</CTableDataCell>
                        <CTableDataCell>{data.User_high}</CTableDataCell>
                        <CTableDataCell>{data.User_mid}</CTableDataCell>
                        <CTableDataCell>{data.User_low}</CTableDataCell>
                        <CTableDataCell>{data.Player_high}</CTableDataCell>
                        <CTableDataCell>{data.Player_mid}</CTableDataCell>
                        <CTableDataCell>{data.Player_low}</CTableDataCell>

                      </CTableRow>
                    );
                  })}
                </CTableBody>
              </CTable>
            }
            <div className=" bg-secondary" style={{ height: `50px` }}></div>
            <h4 className="mt-3 text-black">Balances</h4>
            {
              balances &&
              <CTable>
                <CTableHead>
                  <CTableRow>
                    <ColumnHeader headerCells={headerCellsTable3} />
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow>
                    <CTableDataCell>{"Users"}</CTableDataCell>
                    <CTableDataCell>{balances.today_users}</CTableDataCell>
                    <CTableDataCell>{balances.yesterday_users}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>{"Teams"}</CTableDataCell>
                    <CTableDataCell>{balances.today_team}</CTableDataCell>
                    <CTableDataCell>{balances.yesterday_team}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>{"User Balance"}</CTableDataCell>
                    <CTableDataCell>{balances.today_user_balance}</CTableDataCell>
                    <CTableDataCell>
                      {balances.yesterday_user_balance}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>{"Released Bonus"}</CTableDataCell>
                    <CTableDataCell>
                      {balances.released_bonus_data_today}
                    </CTableDataCell>
                    <CTableDataCell>
                      {balances.released_bonus_data_yesterday}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>{"Locked Bonus"}</CTableDataCell>
                    <CTableDataCell>
                      {balances.locked_bonus_data_today}
                    </CTableDataCell>
                    <CTableDataCell>
                      {balances.locked_bonus_data_yesterday}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>{"Deposit"}</CTableDataCell>
                    <CTableDataCell>
                      {balances.deposit_bonus_data_today}
                    </CTableDataCell>
                    <CTableDataCell>
                      {balances.deposit_bonus_data_yesterday}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>{"Withdraw"}</CTableDataCell>
                    <CTableDataCell>
                      {balances.withdraw_bonus_data_today}
                    </CTableDataCell>
                    <CTableDataCell>
                      {balances.withdraw_bonus_data_yesterday}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>{"Rake"}</CTableDataCell>
                    <CTableDataCell>
                      {balances.rake_bonus_data_today}
                    </CTableDataCell>
                    <CTableDataCell>
                      {balances.rake_bonus_data_yesterday}
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            }

          </>
        )
      )}
    </>
  );
};
export default Dashboard;
