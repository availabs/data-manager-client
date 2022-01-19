import React, { useState, useRef, useEffect } from "react";

import { getFullDataManagerMetadata } from "../../api/getters";

const tableBorderStyle = {
  borderWidth: "1px",
  borderColor: "#aaaaaa",
  borderStyle: "solid",
  padding: 10,
};

const getViewsTable = (dataManagerMetadata: any, viewIds: number[] = []) => {
  console.log({ dataManagerMetadata, viewIds });
  return (
    <table style={tableBorderStyle}>
      <thead>
        <tr style={tableBorderStyle}>
          <th style={tableBorderStyle}>id</th>
          <th style={tableBorderStyle}>data type</th>
          <th style={tableBorderStyle}>interval version</th>
          <th style={tableBorderStyle}>geography version</th>
          <th style={tableBorderStyle}>version</th>
          <th style={tableBorderStyle}>source_url</th>
          <th style={tableBorderStyle}>publisher</th>
          <th style={tableBorderStyle}>data_table</th>
          <th style={tableBorderStyle}>start_date</th>
          <th style={tableBorderStyle}>end_date</th>
          <th style={tableBorderStyle}>last_updated</th>
          <th style={tableBorderStyle}>statistics</th>
          <th style={tableBorderStyle}>metadata</th>
        </tr>
      </thead>
      <tbody>
        {viewIds
          .sort((a, b) => +a - +b)
          .map((vId) => {
            console.log({ vId, view: dataManagerMetadata.viewsById[vId] });

            const {
              id,
              data_type,
              interval_version,
              geography_version,
              version,
              source_url,
              publisher,
              data_table,
              start_date,
              end_date,
              last_updated,
              statistics,
              metadata,
            } = dataManagerMetadata.viewsById[vId].attributes;

            return (
              <tr key={vId}>
                <td style={tableBorderStyle}>{id}</td>
                <td style={tableBorderStyle}>{data_type}</td>
                <td style={tableBorderStyle}>{interval_version}</td>
                <td style={tableBorderStyle}>{geography_version}</td>
                <td style={tableBorderStyle}>{version}</td>
                <td style={tableBorderStyle}>{source_url}</td>
                <td style={tableBorderStyle}>{publisher}</td>
                <td style={tableBorderStyle}>{data_table}</td>
                <td style={tableBorderStyle}>{start_date}</td>
                <td style={tableBorderStyle}>{end_date}</td>
                <td style={tableBorderStyle}>{last_updated}</td>
                <td style={tableBorderStyle}>
                  <pre>{JSON.stringify(statistics, null, 4)}</pre>
                </td>
                <td style={tableBorderStyle}>
                  <pre>{JSON.stringify(metadata, null, 4)}</pre>
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};

const getSourceMetaComp = (dataManagerMetadata: any) => (
  <div key="1">
    {Object.values(dataManagerMetadata.sourcesById).map(
      //@ts-ignore
      (
        {
          attributes: {
            name,
            description,
            update_interval,
            statistics,
            metadata,
          },
          viewIds,
        },
        i
      ) => (
        <div key={i} style={{ padding: 10 }}>
          {" "}
          <span className="text-xl font-semibold">{name}</span>{" "}
          <dl style={{ padding: 20 }}>
            <dt className="text-lg font-normal">description</dt>
            <dd style={{ padding: 20 }} className="text-base font-light">
              {description}
            </dd>

            <dt className="text-lg font-normal">update_interval</dt>
            <dd style={{ padding: 20 }} className="text-base font-light">
              {update_interval}
            </dd>

            <dt className="text-lg font-normal">statistics</dt>
            <dd style={{ padding: 20 }} className="text-base font-light">
              <pre>{JSON.stringify(statistics, null, 4)}</pre>
            </dd>

            <dt className="text-lg font-normal">metadata</dt>
            <dd style={{ padding: 20 }} className="text-base font-light">
              <pre>{JSON.stringify(metadata, null, 4)}</pre>
            </dd>

            <dt className="text-lg font-normal">views</dt>
            <dd style={{ padding: 20 }} className="text-base font-light">
              {getViewsTable(dataManagerMetadata, viewIds)}
            </dd>
          </dl>
        </div>
      )
    )}
  </div>
);

function DataManagerMetadataView() {
  const [ready, setReady] = useState<boolean | null>(false);
  const metadata = useRef<any | null>(null);

  useEffect(() => {
    (async () => {
      metadata.current = await getFullDataManagerMetadata();
      setReady(true);
    })();
  }, []);

  console.log(metadata.current);
  const component = ready ? (
    <div style={{ padding: 0 }} className="text-2xl font-bold">
      <span className="text-3xl font-bold">Sources</span>
      {getSourceMetaComp(metadata.current)}
    </div>
  ) : (
    <div className="text-2xl font-bold">Loading</div>
  );

  // <div className="h-full flex items-center justify-center flex-col">
  return (
    <div>
      <div style={{ padding: 50 }} className="text-4xl font-extrabold">
        AVAIL DataManager Metadata View
      </div>
      <div style={{ padding: 50 }} className="text-2xl font-bold">
        {component}
      </div>
    </div>
  );
}

const config = {
  path: "/",
  exact: true,
  mainNav: false,
  component: DataManagerMetadataView,
  layoutSettings: {
    fixed: true,
    headerBar: false,
    logo: "AVAIL",
    navBar: false,
  },
};

export default config;
