    import React from 'react';
    import { Typography, Container, Box, Card, CardContent, CardMedia, Grid } from '@mui/material';

    const members = [
      {
        name: 'Alex Hsia',
        role: 'Lead Software Engineer',
        image: '/assets/images/alexhsia.png',
        github: 'https://github.com/hsiaalex',
      },
      {
        name: 'Dylan McMullen',
        role: 'Project Manager',
        image: '/assets/images/dylanmcmullen.png',
        github: 'https://github.com/DylanM05',
      },
      {
        name: 'Michael Angelo Cabalinan',
        role: 'Database Programmer',
        image: '/assets/images/michaelcabalinan.png',
        github: 'https://github.com/ethalmus',
      },
      {
        name: 'Cole Ramsey',
        role: 'UI/UX Programmer',
        image: '/assets/images/coleramsey.png',
        github: 'https://github.com/cramyx',
      },
      {
        name: 'Jonathan Au',
        role: 'Web Designer',
        image: '/assets/images/jonathanau.png',
        github: 'https://github.com/wormmy55',
      },
    ];

    const About = () => {
      const openGitHubProfile = (url) => {
        window.open(url, '_blank');
      };

      return (
        <Container>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              my: 4,
              backgroundColor: 'background.paper',
              p: 4,
              borderRadius: '8px',
            }}
          >
            <Typography variant="h3" component="h1" gutterBottom style={{textAlign:"center", fontWeight:"bold", color:"primary"}}>
              ABOUT US
            </Typography>
            <Typography variant="body1" paragraph style={{padding: "10px 20px 0 20px"}}>
              Welcome to EZDealsHub – Where Savings and Convenience Converge!
              This is the About Us page for EZDealsHub, an e-commerce platform created by Group 2 for COMP229-403 (Fall 2023).
              <p />
              EzDealsHub was created by{' '}
              {members.map((member, index) => (
                <React.Fragment key={index}>
                  {index > 0 && index < members.length - 1 && ', '}
                  {index === members.length - 1 && ', and '}
                  <span
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => openGitHubProfile(member.github)}
                  >
                    {member.name}
                  </span>
                </React.Fragment>
              ))}
              .
            </Typography>
            <Typography style={{padding: "10px 20px 0 20px"}}>
            Together, our diverse backgrounds, skills, and shared passion for innovation have fueled the creation of EZDealsHub, and we look forward to continually enhancing your online shopping experience.
            </Typography>
            <Grid
              container
              spacing={2}
              sx={{
                mt: 4,
              }}
            >
              {members.map((member, index) => (
                <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                  <Card
                    sx={{ maxWidth: 250, height: '100%', cursor: 'pointer' }}
                    onClick={() => openGitHubProfile(member.github)}
                  >
                    <CardMedia
                      component="img"
                      image={member.image}
                      alt={`${member.name} image`}
                      sx={{
                        height: 300,
                      }}
                    />
                    <CardContent>
                      <Typography variant="h5" component="h2" style={{textAlign:"center", color:"primary"}}>
                        {member.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" style={{textAlign:"center", color:"primary"}}>
                        {member.role}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      );
    };

    export default About;
