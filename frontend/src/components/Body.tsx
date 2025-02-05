import React, { useEffect, useState } from "react";
import axios from "axios";
import PriceGraph from "./graphs/PriceGraph";
import AverageGraph from "./graphs/AverageGraph";
import MoreInfoGraph from "./graphs/MoreInfoGraph";
import ThemeSwitcher from "./ThemeSwitcher";
import logo from "../assets/cryptocurrency.png";
import VWAPGraph from "./graphs/VWAPGraph";
import StackedAreaGraph from "./graphs/StackedAreaGraph";

export interface PriceData {
  date: number;
  close: number;
  open?: number;
  high?: number;
  low?: number;
}

interface MovingAverageData {
  date: number;
  average: number;
}

function Body() {
  const [coinPrice, setCoinPrice] = useState<PriceData[]>([]);
  const [chartData, setChartData] = useState<PriceData[]>([]);
  const [moreInfoChartData, setMoreInfoChartData] = useState<PriceData[]>([]);
  const [vwapChartData, setVWAPChartData] = useState<PriceData[]>([]);

  const [coinNews, setCoinNews] = useState<any[]>([]);
  const [priceError, setPriceError] = useState<any>(null);
  const [newsError, setNewsError] = useState<any>(null);
  const [timePeriod, setTimePeriod] = useState<string>("1y");
  const [selectedCoin, setSelectedCoin] = useState<string>("bitcoin");
  // const [movingAverageData, setMovingAverageData] = useState<
  //   MovingAverageData[]
  // >([]);

  useEffect(() => {
    setCoinPrice([]);
    setCoinNews([]);
    setPriceError(null);
    setNewsError(null);
    // setMovingAverageData([]);
    setChartData([]);
    setMoreInfoChartData([]);

    fetchData();
  }, [selectedCoin]);

  useEffect(() => {
    filterData();
  }, [timePeriod]);

  const fetchData = async () => {
    try {
      const priceResponse = await axios.get(
        `http://127.0.0.1:8000/FetchCoinPrice/?coin=${selectedCoin}`
      );
      const newsResponse = await axios.get(
        `http://127.0.0.1:8000/FetchCoinNews/?coin=${selectedCoin}`
      );

      setCoinPrice(priceResponse.data);
      setCoinNews(newsResponse.data);
      filterData(priceResponse.data);
    } catch (error) {
      setPriceError(error);
      setNewsError(error);
    }
  };

  const filterData = (data = coinPrice) => {
    let filteredData = data;
    switch (timePeriod) {
      case "1w":
        filteredData = data.slice(0, 7);
        break;
      case "1m":
        filteredData = data.slice(0, 30);
        break;
      case "6m":
        filteredData = data.slice(0, 180);
        break;
      case "1y":
        filteredData = data.slice(0, 365);
        break;
    }
    updateChartData(filteredData);
  };

  const updateChartData = (data: PriceData[]) => {
    const processedPriceData = processDataForGraphs(data);

    setChartData(processedPriceData);
    setMoreInfoChartData(processedPriceData);
    setVWAPChartData(processDataForVWAPGraph(data));
    // setMovingAverageData(calculateMovingAverage(processedPriceData));
  };

  const processDataForGraphs = (data: PriceData[]): PriceData[] => {
    return data.reverse().map((price: any) => ({
      date: new Date(price.Date).getTime(),
      close: parseFloat(price.Close.replace("$", "").replace(",", "")),
      // Assume other data points (open, high, low) are also available
      open: parseFloat(price.Open.replace("$", "").replace(",", "")),
      high: parseFloat(price.High.replace("$", "").replace(",", "")),
      low: parseFloat(price.Low.replace("$", "").replace(",", "")),
    }));
  };

  // const calculateMovingAverage = (data: PriceData[]): MovingAverageData[] => {
  //   return data.map((_, index) => {
  //     // Calculate the average between open and close

  //     const average = (data[index].open! + data[index].close!) / 2;

  //     //Round to 2 decimal places
  //     const roundedAverage = Math.round(average * 100) / 100;
  //     return {
  //       date: data[index].date,
  //       average: roundedAverage,
  //     };
  //   });
  // };

  const processDataForVWAPGraph = (data: PriceData[]): PriceData[] => {
    let runningTotalVolume = 0;
    let runningTotalPriceVolume = 0;

    console.log("VWAPGraph data:", data);

    return data.map((price: any) => {
      const close = parseFloat(price.Close.replace("$", "").replace(",", ""));
      const open = parseFloat(price.Open.replace("$", "").replace(",", ""));
      const high = parseFloat(price.High.replace("$", "").replace(",", ""));
      const low = parseFloat(price.Low.replace("$", "").replace(",", ""));
      const volume = parseFloat(price.Volume.replace("$", "").replace(",", ""));

      runningTotalVolume += volume || 0;
      runningTotalPriceVolume += close * (volume || 0);
      const vwap = runningTotalVolume
        ? runningTotalPriceVolume / runningTotalVolume
        : 0;

      return {
        date: new Date(price.Date).getTime(),
        close: parseFloat(price.Close.replace("$", "").replace(",", "")),
        open: parseFloat(price.Open.replace("$", "").replace(",", "")),
        high: parseFloat(price.High.replace("$", "").replace(",", "")),
        low: parseFloat(price.Low.replace("$", "").replace(",", "")),
        vwap: Math.round(vwap * 100) / 100, // Round to 2 decimal places
      };
    });
  };

  return (
    <>
      <nav className="flex items-center justify-between py-5">
        <img
          src={logo}
          alt="the logo image"
          className="w-[70px] dark:filter dark:invert"
        />
        <select
          onChange={(e) => setSelectedCoin(e.target.value)}
          value={selectedCoin}
          className="ml-4 p-2 rounded border"
        >
          <option value="bitcoin">Bitcoin</option>
          <option value="ethereum">Ethereum</option>
          <option value="tether">Tether</option>
          <option value="bnb">Binance Coin</option>
          <option value="solana">Solana</option>
          <option value="xrp">Ripple</option>
          <option value="cardano">Cardano</option>
          <option value="dogecoin">Dogecoin</option>
          <option value="avalanche">Avalanche</option>
          <option value="tron">Tron</option>
          <option value="uni">Uniswap</option>
          {/* Add more options as needed */}
        </select>
        <ThemeSwitcher />
      </nav>
      <header className="text-center py-5 md:py-14">
        <h1 className="text-xl md:text-4xl dark:text-white">
          <span className="font-extrabold">Crypto Crunch:</span> Riding the
          Rollercoaster!
        </h1>
        <p className="text-sm md:text-lg py-5 text-gray-500 dark:text-white mb-6">
          Buckle up for a wild ride through the peaks and troughs of your
          favorite digital currencies. Track your investments and stay ahead
          with the latest coin news – or just enjoy the thrill from the safety
          of the sidelines!
        </p>

        <div className="flex flex-col justify-start items-start pb-5">
          <h2 className="text-4xl dark:text-white">Coin Price:</h2>
          {coinPrice.length !== 0 ? (
            <>
              <div className="w-full">
                <div className="mb-4">
                  {/* Dropdown or buttons to select time period */}
                  <button
                    className="mx-2"
                    onClick={() => {
                      setTimePeriod("1w");
                      filterData(coinPrice);
                    }}
                  >
                    1 Week
                  </button>
                  <button
                    className="mx-2"
                    onClick={() => {
                      setTimePeriod("1m");
                      filterData(coinPrice);
                    }}
                  >
                    1 Month
                  </button>
                  <button
                    className="mx-2"
                    onClick={() => {
                      setTimePeriod("6m");
                      filterData(coinPrice);
                    }}
                  >
                    6 Months
                  </button>
                  <button
                    className="mx-2"
                    onClick={() => {
                      setTimePeriod("1y");
                      filterData(coinPrice);
                    }}
                  >
                    1 Year
                  </button>
                </div>

                <PriceGraph chartData={chartData} />
                {/* <AverageGraph movingAverageData={movingAverageData} /> */}
                <VWAPGraph vwapData={vwapChartData} />
                <MoreInfoGraph chartData={moreInfoChartData} />
                <StackedAreaGraph chartData={chartData} />
              </div>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>

        <div className="flex flex-col justify-start items-start mt-6">
          <h2 className="text-4xl dark:text-white pb-2">Latest News:</h2>
          {coinNews.length !== 0 ? (
            coinNews.map((news: any, index: any) => (
              <div
                key={index}
                className="news-card flex flex-col justify-start items-start border-b border-b-slate-400 py-2"
              >
                <h3 className="text-2xl text-left font-semibold text-yellow-400 mb-2">
                  {news.title}
                </h3>
                <p className="text-left dark:text-white">{news.description}</p>
                <a
                  href={`https://www.coindesk.com/${news.link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue underline"
                >
                  Read more
                </a>
                <p className="dark:text-white">
                  <small>{news.date}</small>
                </p>
              </div>
            ))
          ) : (
            <p>Loading news...</p>
          )}
          {/* {newsError && (
            <div>
              <h2>Error:</h2>
              <p>{JSON.stringify(newsError)}</p>
            </div>
          )} */}
        </div>
      </header>
    </>
  );
}

export default Body;
