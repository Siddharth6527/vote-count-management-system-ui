import { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { MenuItem } from "@mui/material";
import { API_ROUNDS_URL } from "../../utils/api";

const Tables = () => {
  // for managing dynamic data
  const [rounds, setRounds] = useState(); // for response
  const [rows, setRows] = useState([]); // for middleware data (Array)
  const [currentRound, setCurrentRound] = useState(1); // for cumulative

  const [CVC, setCVC] = useState(0); // candidate-vote-count
  const [CCVC, setCCVC] = useState(0); // cumulative-candidate-vote-count

  // NOTE: LOOK FOR SNACK BAR LOGIC
  // custom function for adding rows
  const addRows = (newRow) => {
    setRows([...rows, newRow]);
  };

  // custom function for updating rows
  const updateRows = (index, newRow) => {
    setRows(rows.map((row, i) => (i === index ? newRow : row)));
  };

  // LOGIC FOR GETTING DATA FROM BACKEND
  // for fetching data
  useEffect(() => {
    // const res = fetchingData();
    // setRounds(res);
    fetchingData().then((res) => setRounds(res));
  }, []);

  async function fetchingData() {
    try {
      // console.log(API_ROUNDS_URL + `?orderBy=${sort}&asc=${order == "asc"}`);
      const response = await fetch(
        API_ROUNDS_URL + `?orderBy=candidateId&asc=true`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.status == 200) {
        console.log(data);
        // setRounds(data);
        return data;
      } else {
        throw new Error();
      }
    } catch (e) {
      // FIX THE LOGIC FOR SNACKBAR-LOADING
      console.log(e);
      // setErrorSnackbarOpen(true);
      // setTimeout(() => setErrorSnackbarOpen(false), 10000);
    }
    // if (indicateLoading) {
    //   setLoading(false);
    // }
  }

  // for middleware
  useEffect(() => {
    if (rounds !== undefined) {
      // call middleware function
      middleware();
    }
  }, [rounds, currentRound]);
  // or currentRound

  function middleware() {
    /////////////////////
    console.log("TESTING PINNING TABLE");
    console.log(rounds);

    // PRE-ADDING all the candidates
    for (var l = 0; l < rounds[0].candidateVoteCounts.length; l++) {
      addRows({
        candidateId: rounds[0].candidateVoteCounts[l].candidate.candidateId,
        candidateName: rounds[0].candidateVoteCounts[l].candidate.candidateName,
        candidateParty:
          rounds[0].candidateVoteCounts[l].candidate.candidateParty,
        candidateCurrentVoteCount: 0,
        candidateCumulativeVoteCount: 0,
        candidateTotal: 0,
      });
    }

    ////////////////////////////
    for (var i = 0; i < rounds.length; i++) {
      // base condition ~ termination
      if (rounds[i].roundId > currentRound) {
        break;
      } else if (rounds[i].roundId < currentRound) {
        // for cumulative sum

        // use another for loop for iterating candidates
        for (var m = 0; m < rounds[i].candidateVoteCounts.length; m++) {
          // set values of CVC, CCVC for previous results
          // search for that cid in rows
          for (var n = 0; n < rows.length; n++) {
            if (rows[n].candidateId == rounds[i].candidateVoteCounts[m]) {
              setCVC(rows[n].candidateCurrentVoteCount);
              setCCVC(rows[n].candidateCumulativeVoteCount);
              break;
            }
          }

          // update values (n is the index of the row)
          updateRows(n, {
            candidateId: rounds[0].candidateVoteCounts[m].candidate.candidateId,
            candidateName:
              rounds[0].candidateVoteCounts[m].candidate.candidateName,
            candidateParty:
              rounds[0].candidateVoteCounts[m].candidate.candidateParty,
            candidateCurrentVoteCount: CVC,
            candidateCumulativeVoteCount:
              CCVC + rounds[i].candidateVoteCounts[m].voteCount,
            candidateTotal: CVC + CCVC,
          });
        }
      } else {
        // roundId === currentRound
        // for current round votes
        // use another for loop for iterating candidates
        for (var m = 0; m < rounds[i].candidateVoteCounts.length; m++) {
          // set values of CVC, CCVC for previous results
          // search for that cid in rows
          for (var n = 0; n < rows.length; n++) {
            if (rows[n].candidateId == rounds[i].candidateVoteCounts[m]) {
              // setCVC(rows[n].candidateCurrentVoteCount);
              setCCVC(rows[n].candidateCumulativeVoteCount);
              break;
            }
          }

          // only changing the CVC and adding CCVC as it is,
          // update values (n is the index of the row)
          updateRows(n, {
            candidateId: rounds[0].candidateVoteCounts[m].candidate.candidateId,
            candidateName:
              rounds[0].candidateVoteCounts[m].candidate.candidateName,
            candidateParty:
              rounds[0].candidateVoteCounts[m].candidate.candidateParty,
            candidateCurrentVoteCount:
              rounds[i].candidateVoteCounts[m].voteCount,
            candidateCumulativeVoteCount: CCVC,
            candidateTotal: CVC + CCVC,
          });
        }
      }
    }
  }

  ///////////////////////////////////////////////
  // FOR DEFINING COLUMNS
  const columns = useMemo(
    () => [
      {
        accessorKey: "candidateName",
        // enableColumnPinning: false, //disable column pinning for this column
        header: "Candidate",
        size: 150,
      },
      //column definitions...
      {
        accessorKey: "candidateParty",
        header: "Party",
        size: 150,
      },
      {
        accessorKey: "candidateCumulativeVoteCount",
        header: "Vote Brought from Previous Rounds",
        size: 50,
      },
      {
        accessorKey: "candidateVoteCount",
        header: "Current Round",
        size: 50,
      },
      {
        accessorKey: "candidateTotal",
        header: "Total",
        size: 50,
      },
    ],
    [rounds]
  );

  if (rows.length !== 0) {
    const table = useMaterialReactTable({
      columns,
      rows,
      enableColumnPinning: true,
      enableRowActions: true,
      layoutMode: "grid-no-grow", //constant column widths
      // renderRowActionMenuItems: () => [<MenuItem key="action">Action</MenuItem>],
      // initialState: {
      //   columnPinning: { left: ["mrt-row-actions", "state"], right: ["city"] },
      // },
    });
    return <MaterialReactTable table={table} />;
  }
};

export default Tables;
