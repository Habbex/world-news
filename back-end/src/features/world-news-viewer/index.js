const getSetting = (getConfig, queue, setting) =>
  getConfig(`app.workerSettings.${queue}.${setting}`);


module.exports = () => {
  return [
    {
        target: "$FETCHQ_REGISTER_QUEUE",
        handler: (_, { getConfig }) => {
          return [
            {
              name: "world_news_viewer"
            }
          ];
        }
      },  
    // {
    //   target: "$START_FEATURE",
    //   handler: async ({ getContext }) => {
    //     const hasura = getContext("hasura");
    //     const res = await hasura.query(MY_QUERY, {
    //       var: "foobar",
    //     });

    //     console.log(res);
    //   },
    // },
  ];
};
