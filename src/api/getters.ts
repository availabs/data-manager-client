import _ from "lodash";

import falcor from "./falcor";

export enum SourceAttributes {
  "id" = "id",
  "name" = "name",
  "update_interval" = "update_interval",
  "category" = "category",
  "description" = "description",
  "statistics" = "statistics",
  "metadata" = "metadata",
}

export enum ViewAttributes {
  "id" = "id",
  "source_id" = "source_id",
  "data_type" = "data_type",
  "interval_version" = "interval_version",
  "geography_version" = "geography_version",
  "version" = "version",
  "source_url" = "source_url",
  "publisher" = "publisher",
  "data_table" = "data_table",
  "download_url" = "download_url",
  "tiles_url" = "tiles_url",
  "start_date" = "start_date",
  "end_date" = "end_date",
  "last_updated" = "last_updated",
  "statistics" = "statistics",
}

export async function getSourcesLength(): Promise<number> {
  const path = ["datamanager", "sources", "length"];

  const resp = await falcor.get(path);

  return _.get(resp.json, path, null);
}

async function fetchAllSourcesAttributes(): Promise<any> {
  const sourcesLength = await getSourcesLength();

  const path = [
    "datamanager",
    "sources",
    "byIndex",
    _.range(sourcesLength),
    "attributes",
    Object.values(SourceAttributes),
  ];

  const resp = await falcor.get(path);

  return resp;
}

async function fetchAllViewsAttributes(): Promise<any> {
  const sourcesLength = await getSourcesLength();

  const path = [
    "datamanager",
    "sources",
    "byIndex",
    _.range(sourcesLength),
    "views",
    "length",
  ];

  const resp = await falcor.get(path);

  const sourcesByIndex = _.get(resp.json, [
    "datamanager",
    "sources",
    "byIndex",
  ]);

  const viewsMetaPaths = Object.keys(sourcesByIndex)
    .map((srcIdx) => {
      const viewsLength = _.get(sourcesByIndex, [srcIdx, "views", "length"]);

      return (
        viewsLength && [
          "datamanager",
          "sources",
          "byIndex",
          srcIdx,
          "views",
          "byIndex",
          _.range(viewsLength),
          "attributes",
          Object.values(ViewAttributes),
        ]
      );
    })
    .filter(Boolean);

  await Promise.all(viewsMetaPaths.map((p) => falcor.get(p)));
}

export async function getFullDataManagerMetadata(): Promise<any> {
  await fetchAllSourcesAttributes();
  await fetchAllViewsAttributes();

  const falcorCache = falcor._root.cache;

  const srcByIdPath = ["datamanager", "sources", "byId"];

  const sourcesIds = Object.keys(_.get(falcorCache, srcByIdPath));

  const sourcesById = sourcesIds.reduce((acc: any, srcId) => {
    const attributesSubGraph = _.get(falcorCache, [
      ...srcByIdPath,
      srcId,
      "attributes",
    ]);

    acc[srcId] = {};

    acc[srcId].attributes = Object.values(SourceAttributes).reduce(
      (attrAcc: any, attr) => {
        attrAcc[attr] = _.get(attributesSubGraph, [attr, "value"]);
        return attrAcc;
      },
      {}
    );

    const viewsByIndexSubGraph = _.get(
      falcorCache,
      [...srcByIdPath, srcId, "views", "byIndex"],
      null
    );

    acc[srcId].viewIds = viewsByIndexSubGraph
      ? Object.values(viewsByIndexSubGraph)
          .map((v) => _.get(v, ["value", 3], null))
          .filter((vId) => vId !== null)
      : [];

    return acc;
  }, {});

  const viewsByIdPath = ["datamanager", "views", "byId"];

  const viewIds = Object.keys(_.get(falcorCache, viewsByIdPath));

  const viewsById = viewIds.reduce((acc: any, viewId) => {
    const attributesSubGraph = _.get(falcorCache, [
      ...viewsByIdPath,
      viewId,
      "attributes",
    ]);

    acc[viewId] = {
      attributes: Object.values(ViewAttributes).reduce((attrAcc: any, attr) => {
        attrAcc[attr] = _.get(attributesSubGraph, [attr, "value"]);
        return attrAcc;
      }, {}),
    };

    return acc;
  }, {});

  return { sourcesById, viewsById };
}
